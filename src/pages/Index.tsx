import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { InputSection } from "@/components/InputSection";
import { ContentGrid } from "@/components/ContentGrid";
import { toast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'completed' | 'error' | 'not-started';
  category: 'free' | 'sales' | 'optional';
}

const Index = () => {
  const [activeStep, setActiveStep] = useState('input');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<Record<string, 'pending' | 'completed' | 'error' | 'not-started'>>({});

  // サンプル生成コンテンツの定義
  const generateSampleContent = (id: string): string => {
    const sampleContents: Record<string, string> = {
      free_content: `# 英語が話せない日本人の3つの致命的な間違い

こんにちは。英語コーチの田中です。

15年間で3,000人以上の日本人に英語を教えてきて気づいたことがあります。

それは、**なぜ日本人だけが英語を話せないのか**という根本的な問題です。

## 間違い1: 完璧な文法を求めすぎる

多くの日本人は「文法が完璧でないと話してはいけない」と思い込んでいます。

しかし、実際のネイティブの会話を聞いてみてください。彼らも文法ミスをしょっちゅうしています。

重要なのは「伝わること」です。

## 間違い2: 単語力ばかりに注力する

「語彙が足りないから話せない」

これも大きな勘違いです。

実は、日常会話の80%は中学英語の単語だけで構成されています。

問題は単語力ではなく、「組み合わせ方」なのです。

## 間違い3: インプットに偏りすぎる

文法書を読む、単語を覚える、リスニングをする...

これらは全てインプットです。

しかし、話せるようになるためにはアウトプットが必要不可欠。

**インプット:アウトプット = 3:7**

この黄金比率を意識するだけで、劇的に変わります。

---

この記事が役に立ったら、私の無料メール講座「15分で変わる英語学習法」をお試しください。

3ヶ月で日常会話から業務レベルまで話せるようになる具体的な方法をお教えします。`,

      sales_letter: `# なぜ、多くの日本人が10年英語を勉強しても話せないのか？

Dear 英語学習者様、

もしあなたが...

☑ 中学・高校・大学と英語を勉強してきたのに話せない
☑ 英会話スクールに通ったけど上達を感じられない  
☑ TOEICスコアは高いのに実際の会話では言葉が出てこない
☑ 外国人との会議で発言できずに悔しい思いをしている

なら、この手紙は重要です。

なぜなら、あなたが英語を話せない理由と、わずか3ヶ月で日常会話から業務レベルまで話せるようになる方法をお伝えするからです。

## あなたは悪くありません

まず最初にお伝えしたいことがあります。

**あなたが英語を話せないのは、あなたの努力が足りないからではありません。**

日本の英語教育システムに問題があるのです。

私は15年間で3,000人以上の日本人に英語を教えてきました。その中で気づいた衝撃的な事実があります。

それは...

**「正しい方法で学べば、誰でも3ヶ月で話せるようになる」**

ということです。

実際に、私の生徒さんの92%が3ヶ月以内に「英語が話せるようになった」と実感しています。

## 従来の英語学習法の3つの致命的な欠陥

### 欠陥1: 完璧主義の罠

日本の英語教育は「間違いを犯してはいけない」という完璧主義を植え付けます。

その結果、多くの人が「完璧に話せるまで話さない」という悪循環に陥ります。

しかし、言語習得における最新の脳科学研究では、「間違いを恐れずに話すことが最も効率的」ということが証明されています。

### 欠陥2: インプット偏重

「もっと単語を覚えなければ」
「もっと文法を勉強しなければ」
「もっとリスニングをしなければ」

これらは全てインプットです。

しかし、話せるようになるためには「アウトプット」が必要不可欠。

私の研究では、インプット:アウトプット = 3:7の比率で学習した人が最も短期間で話せるようになることがわかっています。

### 欠陥3: 継続できないシステム

多くの英語教材や英会話スクールは「継続」を考慮していません。

「毎日2時間勉強しましょう」
「週3回レッスンを受けましょう」

しかし、忙しい現代人にとってこれは現実的ではありません。

継続できなければ、どんなに良い方法でも意味がないのです。

## 3ヶ月で話せるようになる「15分英会話メソッド」

そこで私が開発したのが「15分英会話メソッド」です。

この方法には3つの特徴があります：

### 特徴1: 1日15分だけ
忙しいあなたでも続けられるように、1日わずか15分に凝縮しました。

### 特徴2: アウトプット重視
従来の7倍のアウトプット量を確保し、実際に「話す」ことに特化しています。

### 特徴3: 段階的ステップアップ
脳科学に基づいた段階的カリキュラムで、無理なく上達できます。

## 実際の成果をご覧ください

**田中さん（42歳・営業職）**
「3ヶ月前まで英語が全く話せませんでしたが、先日の海外出張で現地スタッフと流暢に商談できました。15分という短時間なので毎日続けられました。」

**佐藤さん（35歳・主婦）**
「子育てで忙しく時間がない中、スキマ時間を活用して学習。今では外国人ママ友と普通に会話しています。自信がつきました。」

**山田さん（28歳・IT系）**
「TOEICは800点でしたが話せませんでした。このメソッドで実際のコミュニケーション能力が劇的に向上。社内の英語プレゼンも任されるようになりました。」

## オンライン英会話マスター講座の全内容

今回、この「15分英会話メソッド」を完全体系化した「オンライン英会話マスター講座」をリリースします。

### 第1章: マインドセット編（音声講義 60分）
- なぜ日本人は英語を話せないのか？根本原因を解明
- 完璧主義を捨てる具体的な方法
- 英語脳を作る7つの習慣

### 第2章: 基礎スキル編（音声講義 120分 + 専用アプリ）
- 中学英語だけで話せる文型パターン48
- 瞬間英作文トレーニング（専用アプリ付き）
- 発音矯正プログラム

### 第3章: 実践会話編（音声講義 180分 + 動画教材）
- シチュエーション別会話パターン
- ビジネス英語対応モジュール
- プレゼンテーション英語完全攻略

### 第4章: 継続システム編（PDF教材 + チェックシート）
- 習慣化するための21日間プログラム
- 挫折しないための心理学的アプローチ
- 進捗管理システム

### 特典1: ネイティブとの1対1練習セッション（月2回 × 3ヶ月）
実際のネイティブスピーカーとマンツーマンで練習できます。

### 特典2: 専用学習アプリ（3ヶ月利用権）
スマホで学習できる専用アプリで、スキマ時間を有効活用。

### 特典3: 90日間メールサポート
わからないことがあれば、いつでもメールで質問できます。

### 特典4: 学習仲間とのオンラインコミュニティ参加権
同じ目標を持つ仲間と励まし合いながら学習できます。

## 価格について

このプログラムの開発には2年の歳月と500万円の費用をかけました。

英会話スクールに3ヶ月通えば最低でも15万円はかかります。

しかし、より多くの方に英語を話せるようになってほしいという想いから...

**特別価格 29,800円（税込）**

でご提供します。

ただし、この価格は**先着100名様限定**です。

## さらに今だけ限定特典

今すぐお申し込みいただいた方には、以下の限定特典をお付けします：

### 限定特典1: 「ビジネス英語完全攻略セミナー」動画（2時間・98,000円相当）
### 限定特典2: 「英語プレゼンテーション必勝法」PDF（50ページ・19,800円相当）
### 限定特典3: 永久メールサポート（無期限・99,800円相当）

**合計217,600円相当の特典を無料プレゼント！**

## 全額返金保証

もし90日間実践して効果を感じられなければ、理由を問わず全額返金いたします。

あなたにリスクはありません。

## 最後に

私がこのプログラムを作った理由は、一人でも多くの日本人に英語を話せるようになってもらいたいからです。

英語が話せるようになると、人生が大きく変わります。

- 海外旅行がもっと楽しくなる
- 仕事の幅が大幅に広がる  
- 外国人の友達ができる
- 自分に自信が持てるようになる
- 子供に英語を教えられるようになる

もしあなたが本気で英語を話せるようになりたいなら、今すぐ行動してください。

明日やろう、来週やろう、来月やろう...

そう思っているうちに時間だけが過ぎていきます。

**今この瞬間が、あなたの人生を変える分岐点です。**

先着100名様限定の特別価格は、予告なく終了します。

英語が話せる未来の自分に会いに行きませんか？

[今すぐ申し込む] ← このボタンをクリック

追伸：この手紙を読んでいるということは、あなたは本気で英語を話せるようになりたいと思っているはずです。その気持ちを大切にして、今すぐ行動してください。90日後、全く違う世界が待っています。`,

      short_lp: `# 🎁 無料プレゼント：「英語が話せない日本人の3つの致命的な間違い」

## なぜ10年勉強しても英語が話せないのか？

✅ 文法は完璧なのに言葉が出てこない
✅ 単語をたくさん覚えたのに会話できない  
✅ 外国人を前にすると頭が真っ白になる

その理由を無料レポートで公開します。

### このレポートで分かること：

📌 **間違い1**: 完璧主義の罠から抜け出す方法
📌 **間違い2**: 単語力よりも重要な「組み合わせ術」
📌 **間違い3**: インプット:アウトプット黄金比率「3:7の法則」

### さらに特別特典として...

✨ 15分で変わる英語学習法（7日間メール講座）
✨ 中学英語だけで話せる文型パターン20選
✨ ネイティブがよく使う日常フレーズ100

**完全無料でお渡しします！**

---

👇 メールアドレスを入力して今すぐ受け取る 👇

[メールアドレス入力欄]

[無料で受け取る]

※ 個人情報は厳重に管理し、スパムメールは一切送りません
※ 不要になったらいつでも配信停止できます`,

      education_posts: `【教育ポスト1】
英語学習で最も重要なのは「完璧」を求めないこと。

ネイティブでさえ文法ミスをします。
大切なのは「伝わること」。

完璧主義を手放した瞬間、
英語は劇的に上達します。

#英語学習 #完璧主義

---

【教育ポスト2】  
日常英会話の80%は中学英語だけ。

「単語が足りない」は言い訳です。

問題は語彙力ではなく、
知っている単語の「組み合わせ方」。

今持っている知識を
最大限活用しましょう。

#英語 #中学英語

---

【教育ポスト3】
英語上達の黄金比率：
インプット 3 : アウトプット 7

多くの人がインプットに偏りがち。
でも話せるようになるには
「話す練習」が必要不可欠。

今日から比率を意識してみて。

#英語学習法

---

【教育ポスト4】
「英語が話せない」理由の99%は
マインドブロック。

「間違ったらどうしよう」
「恥ずかしい」
「文法が...」

このブロックを外すだけで
見違えるほど話せるようになります。

#英語 #マインドセット

---

【教育ポスト5】
英語学習が続かない理由：
「毎日2時間」という非現実的な目標。

1日15分で十分です。
継続こそが最大の力。

小さな積み重ねが
大きな成果を生みます。

#継続は力なり #英語学習

---

【教育ポスト6】
TOEICスコアと会話力は別物。

TOEIC800点でも話せない人
TOEIC500点でもペラペラな人

この違いは何か？
「アウトプット練習」の量です。

#TOEIC #英会話

---

【教育ポスト7】
英語で最も重要な文型：
SVO（主語+動詞+目的語）

これだけで8割の会話が成立。
複雑な文法は後回しでOK。

シンプルイズベスト。

#英語文法 #SVO

---

【教育ポスト8】
英語学習の最大の敵は
「明日やろう」という先延ばし。

今この瞬間から始められることを
1つでも実行しましょう。

行動が現実を変えます。

#英語学習 #今すぐ行動

---

【教育ポスト9】
英語が話せるようになると：

✅ 海外旅行が10倍楽しい
✅ 仕事の選択肢が広がる
✅ 世界中に友達ができる
✅ 自分に自信が持てる

この未来を手に入れませんか？

#英語のメリット`
    };

    return sampleContents[id] || `生成されたコンテンツ: ${id}`;
  };

  const handleGenerate = async (input: string, inputType: 'product_info' | 'content_text') => {
    setIsGenerating(true);
    setActiveStep('free_content');

    toast({
      title: "生成開始",
      description: "マーケティングコンテンツの生成を開始しました",
    });

    // 段階的にコンテンツを生成
    const contentItems = [
      { id: 'free_content', title: '無料プレゼント用記事', category: 'free' as const },
      { id: 'sales_letter', title: 'セールスレター', category: 'sales' as const },
      { id: 'short_lp', title: 'リストイン用短LP', category: 'free' as const },
      { id: 'education_posts', title: '教育ポスト（9本）', category: 'free' as const },
      { id: 'campaign_post', title: '企画ポスト', category: 'free' as const },
      { id: 'long_lp', title: '商品販売用LP', category: 'sales' as const },
      { id: 'step_mails', title: 'ステップメール（7通）', category: 'sales' as const },
    ];

    // 初期状態を設定
    const initialContents = contentItems.map(item => ({
      ...item,
      content: '',
      status: 'pending' as const
    }));
    
    const initialStatus = contentItems.reduce((acc, item) => {
      acc[item.id] = 'pending';
      return acc;
    }, {} as Record<string, 'pending' | 'completed' | 'error' | 'not-started'>);

    setContents(initialContents);
    setGenerationStatus(initialStatus);

    // 段階的に生成をシミュレート
    for (let i = 0; i < contentItems.length; i++) {
      const item = contentItems[i];
      
      // 生成時間をシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      const generatedContent = generateSampleContent(item.id);
      
      setContents(prev => prev.map(content => 
        content.id === item.id 
          ? { ...content, content: generatedContent, status: 'completed' }
          : content
      ));
      
      setGenerationStatus(prev => ({
        ...prev,
        [item.id]: 'completed'
      }));

      toast({
        title: "生成完了",
        description: `${item.title}の生成が完了しました`,
      });
    }

    setIsGenerating(false);
    
    toast({
      title: "全ての生成が完了しました！",
      description: "マーケティングコンテンツが全て準備できました",
    });
  };

  const handleRegenerate = async (id: string) => {
    setGenerationStatus(prev => ({
      ...prev,
      [id]: 'pending'
    }));

    setContents(prev => prev.map(content => 
      content.id === id 
        ? { ...content, status: 'pending' }
        : content
    ));

    // 再生成をシミュレート
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const regeneratedContent = generateSampleContent(id) + "\n\n[再生成されたコンテンツ]";
    
    setContents(prev => prev.map(content => 
      content.id === id 
        ? { ...content, content: regeneratedContent, status: 'completed' }
        : content
    ));
    
    setGenerationStatus(prev => ({
      ...prev,
      [id]: 'completed'
    }));

    toast({
      title: "再生成完了",
      description: "コンテンツの再生成が完了しました",
    });
  };

  const handleEdit = (id: string, newContent: string) => {
    setContents(prev => prev.map(content => 
      content.id === id 
        ? { ...content, content: newContent }
        : content
    ));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* サイドバー */}
      <Sidebar 
        onStepClick={setActiveStep}
        activeStep={activeStep}
        generationStatus={generationStatus}
      />

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
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
      </div>
    </div>
  );
};

export default Index;
