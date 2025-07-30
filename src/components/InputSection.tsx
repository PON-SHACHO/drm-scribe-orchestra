import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Sparkles, Upload, Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InputSectionProps {
  onGenerate: (input: string, inputType: 'product_info' | 'content_text') => void;
  isGenerating: boolean;
}

export function InputSection({ onGenerate, isGenerating }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<'product_info' | 'content_text'>('product_info');
  const [input, setInput] = useState('');

  const handleGenerate = () => {
    if (!input.trim()) {
      toast({
        title: "入力エラー",
        description: "商品情報またはコンテンツを入力してください",
        variant: "destructive",
      });
      return;
    }

    onGenerate(input, activeTab);
  };

  const exampleTexts = {
    product_info: `【商品例】
商品名: オンライン英会話マスター講座
ターゲット: 英語初心者〜中級者のビジネスパーソン
変化: 3ヶ月で日常英会話から業務レベルまでスムーズに話せるようになる
機能: 毎日15分の音声レッスン + 週1回のオンライン添削 + 専用アプリでの復習システム
価格: 29,800円（3ヶ月コース）
特典: ネイティブとの1対1会話練習セッション月2回`,

    content_text: `【コンテンツ例】
第1章: なぜ多くの日本人が英語を話せないのか？
- 文法重視の学習法の落とし穴
- 「完璧主義」が会話を阻害する理由
- ネイティブと日本人の思考パターンの違い

第2章: 最短で話せるようになる3つの原則
- 原則1: 7:3の黄金比率（インプット:アウトプット）
- 原則2: 1日15分の集中学習法
- 原則3: エラーを恐れないマインドセット

第3章: 実践！即効性のある会話トレーニング
...`
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-large bg-gradient-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                マーケティングコンテンツ生成
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                商品情報またはコンテンツを入力して、DRM戦略コンテンツを一括生成
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="product_info" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                商品情報
              </TabsTrigger>
              <TabsTrigger value="content_text" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                既存コンテンツ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="product_info" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="success">推奨</Badge>
                <span className="text-sm text-muted-foreground">
                  商品の概要、ターゲット、提供する変化について記述
                </span>
              </div>
              
              <Textarea
                placeholder={exampleTexts.product_info}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              
              <div className="text-sm text-muted-foreground">
                💡 商品名、ターゲット、得られる変化、機能、価格などを含めてください
              </div>
            </TabsContent>

            <TabsContent value="content_text" className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="warning">上級者向け</Badge>
                <span className="text-sm text-muted-foreground">
                  note、講座内容、サービスLPなどの既存テキスト
                </span>
              </div>
              
              <Textarea
                placeholder={exampleTexts.content_text}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              
              <div className="text-sm text-muted-foreground">
                💡 既存のコンテンツや原稿をそのまま貼り付けてください
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              文字数: {input.length.toLocaleString()}
            </div>
            
            <Button
              variant="generate"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !input.trim()}
              className="min-w-[180px]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  コンテンツ生成開始
                </>
              )}
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">生成される内容:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="font-medium text-success">🎁 無料プレゼント系</div>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• 無料プレゼント用記事</li>
                  <li>• リストイン用短LP</li>
                  <li>• 教育ポスト×9</li>
                  <li>• 企画ポスト×1</li>
                </ul>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-warning">💰 セールス系</div>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• セールスレター</li>
                  <li>• 商品販売用LP</li>
                  <li>• ステップメール×7</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              ※ オプション: リポスト特典、ウェビナー、VSLも選択可能
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}