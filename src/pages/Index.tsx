import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { InputSection } from "@/components/InputSection";
import { ContentGrid } from "@/components/ContentGrid";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'completed' | 'error';
  category: 'free' | 'sales' | 'optional';
}

const Index = () => {
  const [activeStep, setActiveStep] = useState<'input' | 'content'>('input');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');

  const getTypeDisplayName = (type: string): string => {
    const names = {
      'free_content': '無料プレゼント',
      'sales_letter': 'セールスレター',
      'short_lp': 'リストイン用短LP',
      'education_posts': '教育ポスト（9本セット）',
      'campaign_post': '企画ポスト',
      'long_lp': '商品販売用LP',
      'step_mails': 'ステップメール（7通セット）'
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
      'step_mails': 'sales' as const
    };
    return categories[type] || 'optional';
  };

  const handleGenerate = async (input: string, inputType: 'product_info' | 'content_text') => {
    setIsGenerating(true);
    setActiveStep('content');
    setContents([]);

    try {
      // Generate core content types in sequence
      const coreTypes = ['free_content', 'sales_letter'];
      const derivativeTypes = ['short_lp', 'education_posts', 'campaign_post', 'long_lp', 'step_mails'];

      // Generate core content first
      for (const contentType of coreTypes) {
        setGenerationStatus(`${getTypeDisplayName(contentType)}を生成しています...`);
        
        // Add pending item
        const pendingId = `${contentType}_${Date.now()}`;
        setContents(prev => [...prev, {
          id: pendingId,
          title: getTypeDisplayName(contentType),
          content: '',
          status: 'pending',
          category: getCategoryFromType(contentType)
        }]);

        // Generate content
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: { 
            projectId: 'temp-project', 
            contentType, 
            input, 
            inputType 
          }
        });

        if (error) {
          console.error('Generation error:', error);
          // Update with error status
          setContents(prev => prev.map(item => 
            item.id === pendingId 
              ? { ...item, status: 'error' }
              : item
          ));
          continue;
        }

        // Update with completed content
        setContents(prev => prev.map(item => 
          item.id === pendingId 
            ? { ...item, content: data.content || data.generatedText, status: 'completed' }
            : item
        ));

        toast({
          title: "生成完了",
          description: `${getTypeDisplayName(contentType)}が生成されました`,
        });
      }

      // Generate derivative content
      for (const contentType of derivativeTypes) {
        setGenerationStatus(`${getTypeDisplayName(contentType)}を生成しています...`);
        
        const pendingId = `${contentType}_${Date.now()}`;
        setContents(prev => [...prev, {
          id: pendingId,
          title: getTypeDisplayName(contentType),
          content: '',
          status: 'pending',
          category: getCategoryFromType(contentType)
        }]);

        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: { 
            projectId: 'temp-project', 
            contentType, 
            input, 
            inputType 
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
          description: `${getTypeDisplayName(contentType)}が生成されました`,
        });
      }

      toast({
        title: "全ての生成が完了しました！",
        description: "マーケティングコンテンツ一式の生成が完了しました",
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