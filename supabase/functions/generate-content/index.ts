import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentType, input, inputType } = await req.json();
    
    // Generate content
    const content = await generateContent(contentType, input, inputType);

    return new Response(JSON.stringify({ 
      success: true, 
      content,
      generatedText: content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateContent(contentType: string, input: string, inputType: string): Promise<string> {
  const config = getContentConfig(contentType);
  const prompt = buildPrompt(contentType, input, inputType);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: config.systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: config.maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content generated');
  }

  return content;
}

function getContentConfig(contentType: string) {
  const basePrompt = "あなたは高反応のマーケティングコンテンツ作成の専門家です。日本語で回答してください。スマホ表示に最適化した読みやすい改行と段落構成にしてください。";
  
  const configs = {
    insights_analysis: {
      systemPrompt: "あなたはDRMマーケティングのCMOです。" + basePrompt,
      maxTokens: 2000
    },
    plan_proposal: {
      systemPrompt: "あなたはDRMマーケティングのCMOです。" + basePrompt,
      maxTokens: 3000
    },
    free_content: {
      systemPrompt: "あなたは心理学とマーケティングに精通したライターです。" + basePrompt,
      maxTokens: 6000
    },
    sales_letter: {
      systemPrompt: "あなたはセールスレターの専門家です。" + basePrompt,
      maxTokens: 16000
    },
    education_posts: {
      systemPrompt: basePrompt + " SNS向け教育ポストを作成してください。",
      maxTokens: 8000
    },
    default: {
      systemPrompt: basePrompt,
      maxTokens: 4000
    }
  };

  return configs[contentType] || configs.default;
}

function buildPrompt(contentType: string, input: string, inputType: string): string {
  const inputContext = inputType === 'product_info' 
    ? `商品情報: ${input}`
    : `既存コンテンツ: ${input}`;

  const prompts = {
    insights_analysis: `
ターゲットインサイトの分析を行ってください。
商品情報から以下を推定してください：

・想定ターゲット：
・潜在的なインサイト（葛藤や願望）：
・リードマグネットで惹きつけたい心理ポイント：

${inputContext}`,

    plan_proposal: `
リードマグネットの企画案を5つ提案してください。

【無料プレゼント案】: 【タイトル】
【特典案】： 【タイトル】
【企画概要】： 
【ねらい】： 

最後に選択を促してください。

${inputContext}`,

    free_content: `
読者の認知を変える無料プレゼントコンテンツを作成してください（約5,000字）。
3-5章構成で、読者の変化ステージに沿って構成してください。

${inputContext}`,

    sales_letter: `
12ステップ構成のセールスレターを作成してください。
読者の感情と行動を同時に動かし、購買に導いてください。

${inputContext}`,

    education_posts: `
SNS向け教育ポスト9本セットを作成してください。
各ポストは独立したテーマで、実践的な価値を提供してください。

${inputContext}`,

    default: `
以下の情報に基づいてコンテンツを作成してください。

${inputContext}`
  };

  return prompts[contentType] || prompts.default;
}
