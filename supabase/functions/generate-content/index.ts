import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, contentType, input, inputType } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    // Get user from auth (temporary: skip auth check for now)
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   throw new Error('User not authenticated');
    // }

    // Use a temporary user ID for now
    const userId = 'temp-user-id';

    // Generate content based on type
    const prompt = getPromptForContentType(contentType, input, inputType);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: getSystemPrompt(contentType) },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Save to database (temporarily disabled until tables are created)
    // const { data: contentItem, error } = await supabase
    //   .from('content_items')
    //   .insert({
    //     project_id: projectId,
    //     type: contentType,
    //     title: getTitleForContentType(contentType),
    //     content: generatedContent,
    //     status: 'completed',
    //     user_id: userId
    //   })
    //   .select()
    //   .single();

    // if (error) throw error;

    console.log(`Generated ${contentType} for project ${projectId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      content: generatedContent,
      generatedText: generatedContent
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

function getSystemPrompt(contentType: string): string {
  const basePrompt = "あなたは高反応のマーケティングコンテンツ作成の専門家です。日本語で回答してください。";
  
  switch (contentType) {
    case 'free_content':
      return `${basePrompt} 教育的かつ信頼感のある無料プレゼント用コンテンツを作成してください。価値提供を主眼とし、自然なセールス導線を含めてください。`;
    case 'sales_letter':
      return `${basePrompt} 行動心理学に基づくセールスレターを作成してください。感情→共感→変化→教育→商品導入→価格→限定性→クロージングの流れで構成してください。`;
    case 'short_lp':
      return `${basePrompt} メール登録を促す短尺LPを作成してください。`;
    case 'education_posts':
      return `${basePrompt} SNS向け教育ポストを作成してください。独立したテーマで読みたくなる余白を残してください。`;
    case 'campaign_post':
      return `${basePrompt} SNSでの企画ポスト（告知）を作成してください。`;
    case 'long_lp':
      return `${basePrompt} スキャン読みしやすい商品販売LPを作成してください。`;
    case 'step_mails':
      return `${basePrompt} 心理的ステップに基づいたステップメールを作成してください。`;
    default:
      return basePrompt;
  }
}

function getPromptForContentType(contentType: string, input: string, inputType: string): string {
  const inputContext = inputType === 'product_info' 
    ? `商品情報: ${input}`
    : `既存コンテンツ: ${input}`;

  switch (contentType) {
    case 'free_content':
      return `${inputContext}\n\n上記の情報から、リスト獲得のための無料プレゼント（約3,000文字）を作成してください。教育的で価値の高い内容にし、文末に自然なセールス導線を用意してください。`;
    case 'sales_letter':
      return `${inputContext}\n\n上記の商品情報から、1対1で説得するような超長文セールスレターを作成してください。感情→共感→変化→教育→商品導入→価格→限定性→クロージングという流れを明確に構成してください。`;
    case 'short_lp':
      return `${inputContext}\n\n上記のコンテンツから、メール登録を促す短尺LPを作成してください。構成：1.キャッチコピー 2.サブキャッチ 3.ベネフィット 4.プレゼント紹介 5.登録導線`;
    case 'education_posts':
      return `${inputContext}\n\n上記のコンテンツから、SNS向け教育ポストを9本作成してください。それぞれ独立したテーマで、本編を読みたくなる余白を残してください。`;
    default:
      return `${inputContext}\n\n上記の情報から、${contentType}を作成してください。`;
  }
}

function getTitleForContentType(contentType: string): string {
  const titles = {
    'free_content': '無料プレゼント',
    'sales_letter': 'セールスレター',
    'short_lp': 'リストイン用短LP',
    'education_posts': '教育ポスト',
    'campaign_post': '企画ポスト',
    'long_lp': '商品販売用LP',
    'step_mails': 'ステップメール'
  };
  return titles[contentType] || contentType;
}