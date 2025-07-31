import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Brain, ArrowRight, Lightbulb } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InsightsStepProps {
  productInfo: string;
  onAnalysisComplete: (analysisResult: string) => void;
  onPlanSelect: (selectedPlan: string) => void;
  onPlanGenerate: (analysisResult: string) => Promise<string>;
  analysisResult?: string;
  planProposal?: string;
  isGenerating: boolean;
  generationStatus: string;
  setIsGenerating: (loading: boolean) => void;
}

export function InsightsStep({ 
  productInfo, 
  onAnalysisComplete, 
  onPlanSelect,
  onPlanGenerate,
  analysisResult, 
  planProposal,
  isGenerating,
  generationStatus,
  setIsGenerating
}: InsightsStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const handleAnalysisGenerate = async () => {
    console.log('インサイト分析開始ボタンがクリックされました');
    console.log('商品情報:', productInfo);
    
    if (!productInfo?.trim()) {
      toast({
        title: "エラー",
        description: "商品情報が入力されていません",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('APIを呼び出し中...');
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          projectId: 'temp-project',
          contentType: 'insights_analysis',
          input: productInfo,
          inputType: 'product_info'
        }
      });

      console.log('API呼び出し結果:', { data, error });

      if (error) {
        console.error('API呼び出しエラー:', error);
        throw error;
      }

      const analysisResult = data?.content || data?.generatedText;
      console.log('分析結果:', analysisResult);
      
      if (!analysisResult) {
        throw new Error('分析結果が空です');
      }

      onAnalysisComplete(analysisResult);
      
      toast({
        title: "分析完了",
        description: "ターゲットインサイト分析が完了しました",
      });

    } catch (error) {
      console.error('インサイト分析エラー:', error);
      toast({
        title: "エラー",
        description: `分析中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanGenerate = async () => {
    setIsGenerating(true);
    try {
      const planResult = await onPlanGenerate(analysisResult || '');
      toast({
        title: "企画案生成完了",
        description: "リードマグネット企画案が生成されました",
      });
    } catch (error) {
      console.error('企画案生成エラー:', error);
      toast({
        title: "エラー",
        description: `企画案生成中にエラーが発生しました: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanSelection = () => {
    if (!selectedPlan.trim()) return;
    onPlanSelect(selectedPlan);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Step 1: ターゲットインサイト分析 */}
      <Card className="shadow-large bg-gradient-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                STEP 1: ターゲットインサイト分析
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                CMO視点で商品のターゲットと心理を分析
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!analysisResult ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted flex items-center justify-center">
                <Brain className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">ターゲット分析を開始</p>
              <p className="text-sm text-muted-foreground mb-6">
                商品情報を元にターゲットインサイトを分析します
              </p>
              <Button
                variant="generate"
                size="lg"
                onClick={handleAnalysisGenerate}
                disabled={isGenerating}
                className="min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-5 h-5 mr-2 animate-pulse" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    インサイト分析開始
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div>
              <ContentCard
                id="insights_analysis"
                title="ターゲットインサイト分析結果"
                content={analysisResult}
                status="completed"
                category="free"
                onRegenerate={handleAnalysisGenerate}
                onEdit={() => {}}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: 企画案提示 */}
      {analysisResult && (
        <Card className="shadow-large bg-gradient-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Lightbulb className="w-6 h-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  STEP 2: リードマグネット企画案
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  分析結果を元に5つの企画案を提案
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!planProposal ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium mb-2">企画案を生成</p>
                <p className="text-sm text-muted-foreground mb-6">
                  分析結果を元に最適な企画案を5つ提案します
                </p>
                <Button
                  variant="generate"
                  size="lg"
                  onClick={handlePlanGenerate}
                  disabled={isGenerating}
                  className="min-w-[200px]"
                >
                  {isGenerating ? (
                    <>
                      <Lightbulb className="w-5 h-5 mr-2 animate-pulse" />
                      企画立案中...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5 mr-2" />
                      企画案生成
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div>
                <ContentCard
                  id="plan_proposal"
                  title="リードマグネット企画案（5つ）"
                  content={planProposal}
                  status="completed"
                  category="free"
                  onRegenerate={handlePlanGenerate}
                  onEdit={() => {}}
                />
                
                {/* 企画選択フォーム */}
                <div className="mt-6 p-6 border border-dashed border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default">選択フェーズ</Badge>
                    <span className="text-sm font-medium">どの企画案で進めますか？</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        選択した企画番号と理由をお聞かせください
                      </label>
                      <textarea
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        placeholder="例：「3番の企画を選択します。理由は...」"
                        className="w-full mt-2 p-3 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={4}
                      />
                    </div>
                    
                    <Button
                      onClick={handlePlanSelection}
                      disabled={!selectedPlan.trim()}
                      className="w-full"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      この企画でコンテンツ生成へ進む
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}