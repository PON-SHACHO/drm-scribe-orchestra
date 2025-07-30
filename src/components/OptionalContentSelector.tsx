import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gift, Video, PlayCircle } from "lucide-react";

interface OptionalContentType {
  id: string;
  title: string;
  description: string;
  baseContent: 'free_content' | 'sales_letter';
  icon: React.ReactNode;
}

const optionalContentTypes: OptionalContentType[] = [
  {
    id: 'repost_bonus',
    title: 'リポスト特典',
    description: '無料プレゼントから作る読者参加型の特典コンテンツ',
    baseContent: 'free_content',
    icon: <Gift className="w-5 h-5" />
  },
  {
    id: 'webinar_script',
    title: 'ウェビナー台本とスライド',
    description: '無料プレゼントを活用したウェビナー構成とスライド案',
    baseContent: 'free_content',
    icon: <Video className="w-5 h-5" />
  },
  {
    id: 'vsl_script',
    title: 'VSL台本とスライド',
    description: 'セールスレターを元にしたVSL構成とスライド案',
    baseContent: 'sales_letter',
    icon: <PlayCircle className="w-5 h-5" />
  }
];

interface OptionalContentSelectorProps {
  onGenerate: (selectedOptions: string[]) => void;
  isGenerating: boolean;
  generationStatus: string;
}

export function OptionalContentSelector({ onGenerate, isGenerating, generationStatus }: OptionalContentSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleGenerate = () => {
    if (selectedOptions.length === 0) return;
    onGenerate(selectedOptions);
  };

  const freeContentOptions = optionalContentTypes.filter(opt => opt.baseContent === 'free_content');
  const salesContentOptions = optionalContentTypes.filter(opt => opt.baseContent === 'sales_letter');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-large bg-gradient-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                オプションコンテンツ生成
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                基本コンテンツを元に追加のマーケティング素材を生成
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 無料コンテンツベースのオプション */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="success">無料コンテンツベース</Badge>
              <span className="text-sm text-muted-foreground">
                生成済みの無料プレゼントを元に作成
              </span>
            </div>
            <div className="grid gap-3">
              {freeContentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                    selectedOptions.includes(option.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => handleOptionToggle(option.id)}
                >
                  <Checkbox
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionToggle(option.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {option.icon}
                      <h4 className="font-semibold">{option.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* セールスレターベースのオプション */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="warning">セールスレターベース</Badge>
              <span className="text-sm text-muted-foreground">
                生成済みのセールスレターを元に作成
              </span>
            </div>
            <div className="grid gap-3">
              {salesContentOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                    selectedOptions.includes(option.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                  onClick={() => handleOptionToggle(option.id)}
                >
                  <Checkbox
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleOptionToggle(option.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {option.icon}
                      <h4 className="font-semibold">{option.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 生成ボタン */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedOptions.length}個のオプション選択中
            </div>
            
            <Button
              variant="generate"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || selectedOptions.length === 0}
              className="min-w-[180px]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  {generationStatus || '生成中...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  選択コンテンツ生成
                </>
              )}
            </Button>
          </div>

          {selectedOptions.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              生成したいオプションコンテンツを選択してください
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}