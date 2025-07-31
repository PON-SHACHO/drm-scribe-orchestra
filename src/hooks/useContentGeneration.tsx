import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { QualitySettings } from "@/components/QualitySettings";
import { 
  optimizePrompt, 
  createImprovementPrompt, 
  createQualityEvaluationPrompt 
} from "@/utils/promptOptimizer";

export interface GenerationResult {
  content: string;
  alternatives?: string[];
  evaluation?: string;
  improved?: string;
}

export function useContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [contentHistory, setContentHistory] = useState<{ [key: string]: string[] }>({});

  const generateWithQuality = useCallback(async (
    contentType: string,
    input: string,
    inputType: 'product_info' | 'content_text' | 'analysis_result',
    settings: QualitySettings,
    originalSystemPrompt: string,
    originalUserPrompt: string
  ): Promise<GenerationResult> => {
    setIsGenerating(true);
    
    try {
      // プロンプト最適化
      const optimized = optimizePrompt(
        originalSystemPrompt,
        originalUserPrompt,
        settings,
        contentType,
        contentHistory[contentType]
      );

      let result: GenerationResult = { content: '' };

      if (settings.multipleGeneration) {
        // 複数候補生成
        setGenerationStatus(`${settings.generationCount}つの候補を生成中...`);
        result = await generateMultipleOptions(
          contentType, 
          input, 
          inputType, 
          optimized, 
          settings.generationCount
        );
      } else {
        // 単一生成
        setGenerationStatus('コンテンツを生成中...');
        const singleResult = await generateSingleContent(
          contentType, 
          input, 
          inputType, 
          optimized
        );
        result.content = singleResult;
      }

      // 自動改善の実行
      if (settings.autoImprovement && result.content) {
        setGenerationStatus('自動改善を実行中...');
        result.improved = await improveContent(
          result.content, 
          contentType, 
          settings
        );
      }

      // コンテキスト履歴の更新
      if (settings.contextPreservation) {
        setContentHistory(prev => ({
          ...prev,
          [contentType]: [...(prev[contentType] || []), result.content].slice(-5) // 最新5件を保持
        }));
      }

      return result;

    } catch (error) {
      console.error('Quality generation error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  }, [contentHistory]);

  const generateMultipleOptions = async (
    contentType: string,
    input: string,
    inputType: string,
    optimized: any,
    count: number
  ): Promise<GenerationResult> => {
    const promises = Array.from({ length: count }, (_, index) => 
      supabase.functions.invoke('generate-content', {
        body: {
          projectId: 'temp-project',
          contentType,
          input,
          inputType,
          systemPrompt: optimized.systemPrompt,
          userPrompt: optimized.userPrompt,
          generationIndex: index
        }
      })
    );

    const results = await Promise.allSettled(promises);
    const alternatives: string[] = [];
    let bestContent = '';

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        const content = result.value.data?.content || result.value.data?.generatedText;
        if (content) {
          alternatives.push(content);
          if (index === 0) bestContent = content; // デフォルトで最初の候補を選択
        }
      }
    });

    if (alternatives.length === 0) {
      throw new Error('すべての候補生成に失敗しました');
    }

    return {
      content: bestContent,
      alternatives
    };
  };

  const generateSingleContent = async (
    contentType: string,
    input: string,
    inputType: string,
    optimized: any
  ): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        projectId: 'temp-project',
        contentType,
        input,
        inputType,
        systemPrompt: optimized.systemPrompt,
        userPrompt: optimized.userPrompt
      }
    });

    if (error) throw error;

    const content = data?.content || data?.generatedText;
    if (!content) {
      throw new Error('コンテンツの生成に失敗しました');
    }

    return content;
  };

  const improveContent = async (
    originalContent: string,
    contentType: string,
    settings: QualitySettings
  ): Promise<string> => {
    const improvementPrompt = createImprovementPrompt(
      originalContent, 
      contentType, 
      settings
    );

    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        projectId: 'temp-project',
        contentType: 'improvement',
        input: improvementPrompt,
        inputType: 'content_text',
        isImprovement: true
      }
    });

    if (error) {
      console.error('Improvement failed:', error);
      return originalContent; // 改善に失敗した場合は元のコンテンツを返す
    }

    return data?.content || data?.generatedText || originalContent;
  };

  const evaluateContent = async (
    content: string,
    contentType: string
  ): Promise<string> => {
    const evaluationPrompt = createQualityEvaluationPrompt(content, contentType);

    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        projectId: 'temp-project',
        contentType: 'evaluation',
        input: evaluationPrompt,
        inputType: 'content_text',
        isEvaluation: true
      }
    });

    if (error) throw error;

    return data?.content || data?.generatedText || '評価の取得に失敗しました';
  };

  const selectAlternative = useCallback((
    alternatives: string[], 
    selectedIndex: number
  ): string => {
    if (selectedIndex >= 0 && selectedIndex < alternatives.length) {
      return alternatives[selectedIndex];
    }
    return alternatives[0] || '';
  }, []);

  return {
    generateWithQuality,
    evaluateContent,
    selectAlternative,
    isGenerating,
    generationStatus,
    contentHistory
  };
}