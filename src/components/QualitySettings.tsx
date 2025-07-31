import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Sparkles, RefreshCw, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface QualitySettings {
  multipleGeneration: boolean;
  generationCount: number;
  autoImprovement: boolean;
  contextPreservation: boolean;
  targetAudience: string;
  writingStyle: string;
  qualityFocus: string[];
}

interface QualitySettingsProps {
  settings: QualitySettings;
  onSettingsChange: (settings: QualitySettings) => void;
  onApply: () => void;
  isGenerating: boolean;
}

export function QualitySettings({ 
  settings, 
  onSettingsChange, 
  onApply, 
  isGenerating 
}: QualitySettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSettingChange = (key: keyof QualitySettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleQualityFocusToggle = (focus: string) => {
    const newFocus = settings.qualityFocus.includes(focus)
      ? settings.qualityFocus.filter(f => f !== focus)
      : [...settings.qualityFocus, focus];
    
    handleSettingChange('qualityFocus', newFocus);
  };

  const resetToDefaults = () => {
    onSettingsChange({
      multipleGeneration: false,
      generationCount: 3,
      autoImprovement: false,
      contextPreservation: true,
      targetAudience: "一般",
      writingStyle: "親しみやすい",
      qualityFocus: ["読みやすさ", "説得力"]
    });
    
    toast({
      title: "設定をリセット",
      description: "品質設定をデフォルトに戻しました",
    });
  };

  const qualityFocusOptions = [
    "読みやすさ",
    "説得力", 
    "感情的訴求",
    "論理性",
    "実用性",
    "独創性"
  ];

  return (
    <Card className="shadow-large bg-gradient-card border-primary/20">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">品質最適化設定</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI生成の品質を向上させる高度な設定
              </p>
            </div>
          </div>
          <Badge variant={isExpanded ? "default" : "outline"}>
            {isExpanded ? "展開中" : "クリックで展開"}
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* 複数生成設定 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-accent" />
                  <h3 className="font-medium">複数候補生成</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  同じプロンプトで複数の候補を生成し、最適なものを選択
                </p>
              </div>
              <Switch
                checked={settings.multipleGeneration}
                onCheckedChange={(checked) => handleSettingChange('multipleGeneration', checked)}
              />
            </div>

            {settings.multipleGeneration && (
              <div className="ml-6 space-y-2">
                <label className="text-sm font-medium">生成候補数: {settings.generationCount}</label>
                <Slider
                  value={[settings.generationCount]}
                  onValueChange={([value]) => handleSettingChange('generationCount', value)}
                  max={5}
                  min={2}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  候補数が多いほど選択肢が増えますが、生成時間も長くなります
                </p>
              </div>
            )}
          </div>

          {/* 自動改善設定 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-success" />
                  <h3 className="font-medium">自動改善</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  初稿生成後、自動的に改善・校正を実行
                </p>
              </div>
              <Switch
                checked={settings.autoImprovement}
                onCheckedChange={(checked) => handleSettingChange('autoImprovement', checked)}
              />
            </div>
          </div>

          {/* コンテキスト保持設定 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">コンテキスト保持</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  前回の生成結果を参考にして一貫性を保つ
                </p>
              </div>
              <Switch
                checked={settings.contextPreservation}
                onCheckedChange={(checked) => handleSettingChange('contextPreservation', checked)}
              />
            </div>
          </div>

          {/* ターゲット読者設定 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ターゲット読者</label>
            <Select
              value={settings.targetAudience}
              onValueChange={(value) => handleSettingChange('targetAudience', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="初心者">初心者</SelectItem>
                <SelectItem value="一般">一般</SelectItem>
                <SelectItem value="専門家">専門家</SelectItem>
                <SelectItem value="ビジネス">ビジネス関係者</SelectItem>
                <SelectItem value="若年層">若年層</SelectItem>
                <SelectItem value="中高年">中高年</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 文体設定 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">文体・トーン</label>
            <Select
              value={settings.writingStyle}
              onValueChange={(value) => handleSettingChange('writingStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="フォーマル">フォーマル</SelectItem>
                <SelectItem value="親しみやすい">親しみやすい</SelectItem>
                <SelectItem value="情熱的">情熱的</SelectItem>
                <SelectItem value="専門的">専門的</SelectItem>
                <SelectItem value="カジュアル">カジュアル</SelectItem>
                <SelectItem value="説得的">説得的</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 品質重視項目 */}
          <div className="space-y-3">
            <label className="text-sm font-medium">品質重視項目（複数選択可）</label>
            <div className="grid grid-cols-2 gap-2">
              {qualityFocusOptions.map((focus) => (
                <Button
                  key={focus}
                  variant={settings.qualityFocus.includes(focus) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQualityFocusToggle(focus)}
                  className="justify-start"
                >
                  {focus}
                </Button>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onApply}
              disabled={isGenerating}
              className="flex-1"
              variant="generate"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              設定を適用して生成
            </Button>
            <Button
              onClick={resetToDefaults}
              variant="outline"
              disabled={isGenerating}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              リセット
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}