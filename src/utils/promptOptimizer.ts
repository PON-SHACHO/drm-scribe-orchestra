import { QualitySettings } from "@/components/QualitySettings";

export interface OptimizedPrompt {
  systemPrompt: string;
  userPrompt: string;
  shouldUseMultipleGeneration: boolean;
  shouldUseAutoImprovement: boolean;
}

export function optimizePrompt(
  originalSystemPrompt: string,
  originalUserPrompt: string,
  settings: QualitySettings,
  contentType: string,
  previousContext?: string[]
): OptimizedPrompt {
  
  // システムプロンプトの強化
  let enhancedSystemPrompt = enhanceSystemPrompt(
    originalSystemPrompt, 
    settings, 
    contentType
  );
  
  // ユーザープロンプトの構造化
  let enhancedUserPrompt = structureUserPrompt(
    originalUserPrompt, 
    settings, 
    contentType,
    previousContext
  );
  
  return {
    systemPrompt: enhancedSystemPrompt,
    userPrompt: enhancedUserPrompt,
    shouldUseMultipleGeneration: settings.multipleGeneration,
    shouldUseAutoImprovement: settings.autoImprovement
  };
}

function enhanceSystemPrompt(
  originalPrompt: string, 
  settings: QualitySettings, 
  contentType: string
): string {
  let enhanced = originalPrompt;
  
  // 人格・専門性の明確化
  const expertiseMap = {
    'insights_analysis': 'DRMマーケティングの実績豊富なCMO',
    'plan_proposal': '戦略的思考に長けたマーケティングプランナー',
    'free_content': '心理学とマーケティングを熟知したトップライター',
    'sales_letter': '神田昌典やゲイリーハルバート級のセールスライティング専門家',
    'education_posts': 'SNSマーケティングとエンゲージメント設計のスペシャリスト'
  };
  
  const expertise = expertiseMap[contentType] || 'マーケティングコンテンツの専門家';
  
  // ターゲット読者に応じた文体調整
  const audienceInstructions = {
    '初心者': '専門用語を避け、分かりやすい表現を使用してください。',
    '専門家': '業界の専門用語や高度な概念を適切に使用してください。',
    'ビジネス': 'ビジネス的な観点と実用性を重視してください。',
    '若年層': '親しみやすく、エネルギッシュなトーンを使用してください。',
    '中高年': '丁寧で信頼感のある表現を心がけてください。',
    '一般': '幅広い読者に理解しやすい表現を使用してください。'
  };
  
  // 文体スタイルの指定
  const styleInstructions = {
    'フォーマル': '敬語を使用し、格式高い文章にしてください。',
    '親しみやすい': '読者との距離感を縮め、親近感のある文章にしてください。',
    '情熱的': '感情に訴える力強い表現を使用してください。',
    '専門的': '正確性と詳細さを重視した文章にしてください。',
    'カジュアル': 'リラックスした雰囲気の文章にしてください。',
    '説得的': '論理的根拠と感情的訴求を組み合わせた説得力のある文章にしてください。'
  };
  
  // 品質重視項目の指示
  const qualityInstructions = settings.qualityFocus.map(focus => {
    const focusMap = {
      '読みやすさ': '文章の流れと構造を重視し、読みやすさを最優先にしてください。',
      '説得力': '論理的根拠と感情的訴求を効果的に組み合わせてください。',
      '感情的訴求': '読者の感情に強く響く表現と具体的エピソードを使用してください。',
      '論理性': '明確な論理構造と根拠に基づいた主張を展開してください。',
      '実用性': '読者が即座に実践できる具体的なアクションを提示してください。',
      '独創性': '他にはない独自の視点や新しいアプローチを取り入れてください。'
    };
    return focusMap[focus];
  }).join('\n');
  
  enhanced = `あなたは${expertise}です。
  
${enhanced}

【ターゲット読者への配慮】
${audienceInstructions[settings.targetAudience]}

【文体・トーンの指定】
${styleInstructions[settings.writingStyle]}

【品質重視項目】
${qualityInstructions}

【追加指示】
- スマホ表示を考慮し、60-80文字程度で適度に改行してください
- 重要なポイントは太字や箇条書きを効果的に使用してください
- 読者の行動を促す明確なCTAを含めてください
- 感情と論理のバランスを取った説得力のある文章にしてください`;

  return enhanced;
}

function structureUserPrompt(
  originalPrompt: string, 
  settings: QualitySettings, 
  contentType: string,
  previousContext?: string[]
): string {
  let structured = originalPrompt;
  
  // コンテキスト保持の場合、過去の生成結果を参照
  if (settings.contextPreservation && previousContext && previousContext.length > 0) {
    const contextSection = `
【これまでの生成コンテキスト】
以下は同じプロジェクトで過去に生成されたコンテンツです。一貫性を保ちながら新しいコンテンツを作成してください：

${previousContext.slice(-2).join('\n\n---\n\n')}
`;
    structured = contextSection + '\n\n' + structured;
  }
  
  // ターゲット読者の明示
  const audienceSection = `
【ターゲット読者】
${settings.targetAudience}向けのコンテンツとして作成してください。
`;
  
  // 品質要件の明示
  const qualitySection = `
【品質要件】
以下の点を特に重視してください：
${settings.qualityFocus.map(focus => `・${focus}`).join('\n')}
`;
  
  // 出力形式の指定
  const formatSection = `
【出力形式要件】
・スマホ表示最適化（60-80文字での改行）
・${settings.writingStyle}なトーンで執筆
・見出し、太字、箇条書きを効果的に使用
・明確なCTA（行動喚起）を含む
`;
  
  structured = `${audienceSection}

${qualitySection}

${formatSection}

【コンテンツ生成要求】
${structured}`;
  
  return structured;
}

export function createImprovementPrompt(
  originalContent: string, 
  contentType: string,
  settings: QualitySettings
): string {
  return `以下のコンテンツを、より高品質になるよう改善・校正してください。

【改善重視項目】
${settings.qualityFocus.map(focus => `・${focus}`).join('\n')}

【ターゲット読者】
${settings.targetAudience}

【希望する文体】
${settings.writingStyle}

【改善指示】
1. 文章の流れと構造を最適化
2. より魅力的で読みやすい表現に修正
3. 論理性と感情的訴求のバランス調整
4. スマホ表示での読みやすさ向上
5. より強力なCTA（行動喚起）への改善

【元のコンテンツ】
${originalContent}

【改善版を出力してください】`;
}

export function createQualityEvaluationPrompt(
  content: string, 
  contentType: string
): string {
  return `以下のコンテンツを客観的に評価し、改善提案をしてください。

【評価項目】
1. 読みやすさ（5点満点）
2. 説得力（5点満点）
3. 感情的訴求力（5点満点）
4. 論理性（5点満点）
5. 実用性（5点満点）
6. 独創性（5点満点）

【評価対象コンテンツ】
${content}

【評価形式】
各項目について点数と理由を述べ、最後に総合評価と具体的な改善提案を3つ以上提示してください。`;
}