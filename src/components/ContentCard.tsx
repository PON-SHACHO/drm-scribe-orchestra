import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Copy, 
  RefreshCw, 
  Edit3, 
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContentCardProps {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'completed' | 'error' | 'not-started';
  category: 'free' | 'sales' | 'optional';
  onRegenerate?: () => void;
  onEdit?: (newContent: string) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'free':
      return 'success';
    case 'sales':
      return 'warning';
    case 'optional':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-warning animate-pulse" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    default:
      return <div className="w-4 h-4 rounded-full border-2 border-muted" />;
  }
};

export function ContentCard({ 
  id, 
  title, 
  content, 
  status, 
  category,
  onRegenerate,
  onEdit 
}: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "コピーしました",
        description: "コンテンツがクリップボードにコピーされました",
      });
    } catch (err) {
      toast({
        title: "コピーエラー",
        description: "コンテンツのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editContent);
    }
    setIsEditing(false);
    toast({
      title: "保存しました",
      description: "コンテンツの編集を保存しました",
    });
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const truncatedContent = content.length > 200 
    ? content.substring(0, 200) + "..." 
    : content;

  const displayContent = isExpanded ? content : truncatedContent;

  return (
    <Card className="h-full flex flex-col shadow-medium hover:shadow-large transition-all duration-300 bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-foreground">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getCategoryColor(category)} className="text-xs">
                {category === 'free' ? '無料系' : 
                 category === 'sales' ? 'セールス系' : 'オプション'}
              </Badge>
              {getStatusIcon(status)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* コンテンツ表示/編集エリア */}
        <div className="flex-1 mb-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="コンテンツを編集..."
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="success" 
                  onClick={handleSaveEdit}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {status === 'pending' ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 animate-pulse" />
                    <span className="text-sm">生成中...</span>
                  </div>
                </div>
              ) : status === 'error' ? (
                <div className="flex items-center justify-center h-32 text-destructive">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8" />
                    <span className="text-sm">生成エラー</span>
                  </div>
                </div>
              ) : status === 'not-started' ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-muted" />
                    <span className="text-sm">未生成</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {displayContent}
                  </div>
                  {content.length > 200 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="self-start p-0 h-auto text-primary hover:text-primary-hover"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          折りたたむ
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          全て表示
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* アクションボタン */}
        {status === 'completed' && !isEditing && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-1" />
              コピー
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              編集
            </Button>
            {onRegenerate && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRegenerate}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                再生成
              </Button>
            )}
          </div>
        )}

        {status === 'error' && onRegenerate && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onRegenerate}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            再試行
          </Button>
        )}
      </CardContent>
    </Card>
  );
}