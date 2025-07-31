import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, RefreshCw, Eye, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AlternativeSelectorProps {
  alternatives: string[];
  currentContent: string;
  onSelect: (selectedIndex: number, selectedContent: string) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
  title: string;
}

export function AlternativeSelector({
  alternatives,
  currentContent,
  onSelect,
  onRegenerate,
  isGenerating,
  title
}: AlternativeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'full'>('preview');

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect(index, alternatives[index]);
    toast({
      title: "候補を選択",
      description: `候補${index + 1}を選択しました`,
    });
  };

  const truncateContent = (content: string, maxLength: number = 200): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getQualityScore = (content: string): number => {
    // 簡易的な品質スコア計算（実際はより精密なアルゴリズムを使用）
    let score = 0;
    
    // 文字数のバランス
    if (content.length > 500 && content.length < 3000) score += 2;
    else if (content.length > 200) score += 1;
    
    // 改行とフォーマット
    const paragraphs = content.split('\n\n').length;
    if (paragraphs > 2) score += 1;
    
    // 見出しや太字の使用
    if (content.includes('**') || content.includes('#')) score += 1;
    
    // 箇条書きの使用
    if (content.includes('・') || content.includes('-') || content.includes('*')) score += 1;
    
    return Math.min(score, 5);
  };

  if (!alternatives || alternatives.length <= 1) {
    return null;
  }

  return (
    <Card className="mt-4 border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-accent" />
            <CardTitle className="text-lg">
              {title} - 候補選択 ({alternatives.length}個)
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'preview' ? 'full' : 'preview')}
            >
              {viewMode === 'preview' ? '全文表示' : 'プレビュー'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isGenerating}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              再生成
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
            {alternatives.map((_, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="relative"
              >
                候補{index + 1}
                {selectedIndex === index && (
                  <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-success" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {alternatives.map((content, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-4">
              <div className="space-y-3">
                {/* 品質情報 */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < getQualityScore(content) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="outline">
                    {content.length}文字
                  </Badge>
                  {selectedIndex === index && (
                    <Badge variant="default">選択中</Badge>
                  )}
                </div>

                {/* コンテンツプレビュー */}
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="whitespace-pre-wrap text-sm">
                    {viewMode === 'preview' 
                      ? truncateContent(content) 
                      : content
                    }
                  </div>
                </div>

                {/* 選択ボタン */}
                <Button
                  onClick={() => handleSelect(index)}
                  variant={selectedIndex === index ? "default" : "outline"}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {selectedIndex === index ? '選択済み' : 'この候補を選択'}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}