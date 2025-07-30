import { ContentCard } from "./ContentCard";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'completed' | 'error' | 'not-started';
  category: 'free' | 'sales' | 'optional';
}

interface ContentGridProps {
  contents: ContentItem[];
  onRegenerate: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
}

export function ContentGrid({ contents, onRegenerate, onEdit }: ContentGridProps) {
  if (contents.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-lg font-medium">コンテンツが生成されていません</p>
          <p className="text-sm">商品情報を入力して生成を開始してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          id={content.id}
          title={content.title}
          content={content.content}
          status={content.status}
          category={content.category}
          onRegenerate={() => onRegenerate(content.id)}
          onEdit={(newContent) => onEdit(content.id, newContent)}
        />
      ))}
    </div>
  );
}