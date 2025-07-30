import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { InputSection } from "@/components/InputSection";
import { ContentGrid } from "@/components/ContentGrid";
import { OptionalContentSelector } from "@/components/OptionalContentSelector";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'completed' | 'error';
  category: 'free' | 'sales' | 'optional';
}

const Index = () => {
  const [activeStep, setActiveStep] = useState<'input' | 'content' | 'optional'>('input');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [coreContentGenerated, setCoreContentGenerated] = useState(false);
  const [generatedCoreContent, setGeneratedCoreContent] = useState<{ [key: string]: string }>({});

  const getTypeDisplayName = (type: string): string => {
    const names = {
      'free_content': '無料プレゼント',
      'sales_letter': 'セールスレター',
      'short_lp': 'リストイン用短LP',
      'education_posts': '教育ポスト（9本セット）',
      'campaign_post': '企画ポスト',
      'long_lp': '商品販売用LP',
      'step_mails': 'ステップメール（7通セット）',
      'repost_bonus': 'リポスト特典',
      'webinar_script': 'ウェビナー台本とスライド',
      'vsl_script': 'VSL台本とスライド'
    };
    return names[type] || type;
  };

  const getCategoryFromType = (type: string): 'free' | 'sales' | 'optional' => {
    const categories = {
      'free_content': 'free' as const,
      'sales_letter': 'sales' as const,
      'short_lp': 'free' as const,
      'education_posts': 'free' as const,
      'campaign_post': 'free' as const,
      'long_lp': 'sales' as const,
      'step_mails': 'sales' as const,
      'repost_bonus': 'optional' as const,
      'webinar_script': 'optional' as const,
      'vsl_script': 'optional' as const
    };
    return categories[type] || 'optional';
  };

  const handleGenerate = async (input: string, inputType: 'product_info' | 'content_text') => {
    setIsGenerating(true);
    setActiveStep('content');
    setContents([]);

    try {
      // Step 1: Generate core content types in parallel
      const coreTypes = ['free_content', 'sales_letter'];
      const generatedCoreContent: { [key: string]: string } = {};

      setGenerationStatus('コアコンテンツを並列生成しています...');

      // Add pending items for core content
      const corePendingIds = coreTypes.map(contentType => {
        const pendingId = `${contentType}_${Date.now()}`;
        setContents(prev => [...prev, {
          id: pendingId,
          title: getTypeDisplayName(contentType),
          content: '',
          status: 'pending',
          category: getCategoryFromType(contentType)
        }]);
        return { contentType, pendingId };
      });

      // Generate core content in parallel
      const corePromises = coreTypes.map(contentType => 
        supabase.functions.invoke('generate-content', {
          body: { 
            projectId: 'temp-project', 
            contentType, 
            input, 
            inputType 
          }
        })
      );

      const coreResults = await Promise.allSettled(corePromises);

      // Process core results
      coreResults.forEach((result, index) => {
        const { contentType, pendingId } = corePendingIds[index];
        
        if (result.status === 'fulfilled' && !result.value.error) {
          const generatedContent = result.value.data.content || result.value.data.generatedText;
          generatedCoreContent[contentType] = generatedContent;
          
          setContents(prev => prev.map(item => 
            item.id === pendingId 
              ? { ...item, content: generatedContent, status: 'completed' }
              : item
          ));

          toast({
            title: "生成完了",
            description: `${getTypeDisplayName(contentType)}が生成されました`,
          });
        } else {
          console.error('Core generation error:', result);
          setContents(prev => prev.map(item => 
            item.id === pendingId 
              ? { ...item, status: 'error' }
              : item
          ));
        }
      });

      // Step 2: Generate derivative content in parallel by category
      const derivativeTypes = ['short_lp', 'education_posts', 'campaign_post', 'long_lp', 'step_mails'];
      
      setGenerationStatus('派生コンテンツを並列生成しています...');

      // Add pending items for derivative content
      const derivativePendingIds = derivativeTypes.map(contentType => {
        const pendingId = `${contentType}_${Date.now()}`;
        setContents(prev => [...prev, {
          id: pendingId,
          title: getTypeDisplayName(contentType),
          content: '',
          status: 'pending',
          category: getCategoryFromType(contentType)
        }]);
        return { contentType, pendingId };
      });

      // Generate derivative content in parallel
      const derivativePromises = derivativeTypes.map(contentType => {
        const baseContentType = getCategoryFromType(contentType) === 'free' ? 'free_content' : 'sales_letter';
        const baseContent = generatedCoreContent[baseContentType];

        return supabase.functions.invoke('generate-content', {
          body: { 
            projectId: 'temp-project', 
            contentType, 
            input: baseContent,
            inputType: 'content_text'
          }
        });
      });

      const derivativeResults = await Promise.allSettled(derivativePromises);

      // Process derivative results
      derivativeResults.forEach((result, index) => {
        const { contentType, pendingId } = derivativePendingIds[index];
        
        if (result.status === 'fulfilled' && !result.value.error) {
          const generatedContent = result.value.data.content || result.value.data.generatedText;
          
          setContents(prev => prev.map(item => 
            item.id === pendingId 
              ? { ...item, content: generatedContent, status: 'completed' }
              : item
          ));

          toast({
            title: "生成完了",
            description: `${getTypeDisplayName(contentType)}が生成されました`,
          });
        } else {
          console.error('Derivative generation error:', result);
          setContents(prev => prev.map(item => 
            item.id === pendingId 
              ? { ...item, status: 'error' }
              : item
          ));
        }
      });

      // Store core content for optional generation
      setGeneratedCoreContent(generatedCoreContent);
      setCoreContentGenerated(true);
      setActiveStep('optional');

      toast({
        title: "基本コンテンツ生成完了！",
        description: "オプションコンテンツを選択して追加生成できます",
      });

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "エラー",
        description: `コンテンツ生成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const handleOptionalGenerate = async (selectedOptions: string[]) => {
    setIsGenerating(true);
    setActiveStep('content');

    try {
      for (const optionType of selectedOptions) {
        setGenerationStatus(`${getTypeDisplayName(optionType)}を生成しています...`);
        
        const pendingId = `${optionType}_${Date.now()}`;
        setContents(prev => [...prev, {
          id: pendingId,
          title: getTypeDisplayName(optionType),
          content: '',
          status: 'pending',
          category: 'optional'
        }]);

        // Determine base content type
        const baseContentType = optionType === 'vsl_script' ? 'sales_letter' : 'free_content';
        const baseContent = generatedCoreContent[baseContentType];

        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: { 
            projectId: 'temp-project', 
            contentType: optionType, 
            input: baseContent,
            inputType: 'content_text'
          }
        });

        if (error) {
          console.error('Generation error:', error);
          setContents(prev => prev.map(item => 
            item.id === pendingId 
              ? { ...item, status: 'error' }
              : item
          ));
          continue;
        }

        setContents(prev => prev.map(item => 
          item.id === pendingId 
            ? { ...item, content: data.content || data.generatedText, status: 'completed' }
            : item
        ));

        toast({
          title: "生成完了",
          description: `${getTypeDisplayName(optionType)}が生成されました`,
        });
      }

      toast({
        title: "オプション生成完了！",
        description: "選択されたオプションコンテンツの生成が完了しました",
      });

    } catch (error) {
      console.error('Optional generation error:', error);
      toast({
        title: "エラー",
        description: `オプションコンテンツ生成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const handleRegenerate = async (id: string) => {
    setContents(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'pending' as const } : item
    ));

    try {
      // For now, just regenerate with a simple approach
      const contentType = id.split('_')[0];
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          projectId: 'temp-project',
          contentType,
          input: 'Sample input for regeneration',
          inputType: 'product_info'
        }
      });

      if (error) throw error;

      setContents(prev => prev.map(item => 
        item.id === id 
          ? { ...item, content: data.content || data.generatedText, status: 'completed' as const }
          : item
      ));

      toast({
        title: "再生成完了",
        description: "コンテンツが再生成されました",
      });
    } catch (error) {
      setContents(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'error' as const } : item
      ));
      
      toast({
        title: "エラー",
        description: `再生成に失敗しました: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string, newContent: string) => {
    setContents(prev => prev.map(item => 
      item.id === id ? { ...item, content: newContent } : item
    ));
    
    toast({
      title: "保存完了",
      description: "コンテンツが更新されました",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar 
          activeStep={activeStep}
          contents={contents}
          isGenerating={isGenerating}
          generationStatus={generationStatus}
        />
        <main className="flex-1">
          {activeStep === 'input' ? (
            <InputSection 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          ) : activeStep === 'optional' ? (
            <OptionalContentSelector
              onGenerate={handleOptionalGenerate}
              isGenerating={isGenerating}
              generationStatus={generationStatus}
            />
          ) : (
            <ContentGrid 
              contents={contents}
              onRegenerate={handleRegenerate}
              onEdit={handleEdit}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;