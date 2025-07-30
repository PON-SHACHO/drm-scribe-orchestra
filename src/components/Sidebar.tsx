import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Users, 
  Video, 
  Presentation,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'completed' | 'error';
  category: 'free' | 'sales' | 'optional';
}

interface SidebarProps {
  activeStep: string;
  contents: ContentItem[];
  isGenerating: boolean;
  generationStatus: string;
}

const generationSteps = [
  {
    id: 'input',
    title: '商品情報入力',
    icon: FileText,
    category: 'setup'
  },
  {
    id: 'free_content',
    title: '無料プレゼント',
    icon: FileText,
    category: 'core'
  },
  {
    id: 'sales_letter',
    title: 'セールスレター',
    icon: Mail,
    category: 'core'
  },
  {
    id: 'short_lp',
    title: 'リストインLP',
    icon: FileText,
    category: 'free_derived'
  },
  {
    id: 'education_posts',
    title: '教育ポスト',
    icon: MessageSquare,
    category: 'free_derived'
  },
  {
    id: 'campaign_post',
    title: '企画ポスト',
    icon: Users,
    category: 'free_derived'
  },
  {
    id: 'long_lp',
    title: '販売用LP',
    icon: FileText,
    category: 'sales_derived'
  },
  {
    id: 'step_mails',
    title: 'ステップメール',
    icon: Mail,
    category: 'sales_derived'
  },
  {
    id: 'repost_bonus',
    title: 'リポスト特典',
    icon: Users,
    category: 'optional'
  },
  {
    id: 'webinar',
    title: 'ウェビナー',
    icon: Video,
    category: 'optional'
  },
  {
    id: 'vsl',
    title: 'VSL',
    icon: Presentation,
    category: 'optional'
  }
];

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

const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'setup':
      return '初期設定';
    case 'core':
      return 'コア生成';
    case 'free_derived':
      return '無料コンテンツ系';
    case 'sales_derived':
      return 'セールス系';
    case 'optional':
      return 'オプション';
    default:
      return '';
  }
};

const getCategoryBadgeVariant = (category: string) => {
  switch (category) {
    case 'setup':
      return 'secondary';
    case 'core':
      return 'default';
    case 'free_derived':
      return 'success';
    case 'sales_derived':
      return 'warning';
    case 'optional':
      return 'outline';
    default:
      return 'outline';
  }
};

export function Sidebar({ activeStep, contents, isGenerating, generationStatus }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('core');

  // Create status mapping from contents
  const statusMap = contents.reduce((acc, item) => {
    acc[item.id.split('_')[0]] = item.status;
    return acc;
  }, {} as Record<string, 'pending' | 'completed' | 'error' | 'not-started'>);

  const categorizedSteps = generationSteps.reduce((acc, step) => {
    if (!acc[step.category]) {
      acc[step.category] = [];
    }
    acc[step.category].push(step);
    return acc;
  }, {} as Record<string, typeof generationSteps>);

  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* ヘッダー */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground mb-2">
          マーケティング
        </h1>
        <h2 className="text-lg text-sidebar-primary">
          コンテンツ生成システム
        </h2>
        <p className="text-sm text-sidebar-foreground/70 mt-2">
          DRM戦略コンテンツを一括生成
        </p>
      </div>

      {/* 生成フロー */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isGenerating && generationStatus && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">{generationStatus}</p>
          </div>
        )}
        <div className="space-y-4">
          {Object.entries(categorizedSteps).map(([category, steps]) => (
            <Card key={category} className="bg-sidebar-accent/50 border-sidebar-border">
              <div 
                className="p-3 cursor-pointer"
                onClick={() => setExpandedCategory(
                  expandedCategory === category ? null : category
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sidebar-foreground">
                      {getCategoryTitle(category)}
                    </h3>
                    <Badge variant={getCategoryBadgeVariant(category)} className="text-xs">
                      {steps.length}
                    </Badge>
                  </div>
                  <div className="text-sidebar-foreground/50">
                    {expandedCategory === category ? '−' : '+'}
                  </div>
                </div>
              </div>

              {expandedCategory === category && (
                <div className="px-3 pb-3 space-y-2">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const status = statusMap[step.id] || 'not-started';
                    const isActive = false; // For now, no active step highlighting

                    return (
                      <div
                        key={step.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-md ${
                          isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                            : "text-sidebar-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1 font-medium">{step.title}</span>
                        {getStatusIcon(status)}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 設定ボタン */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="w-4 h-4 mr-2" />
          設定
        </Button>
      </div>
    </div>
  );
}