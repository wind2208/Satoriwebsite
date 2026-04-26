export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  source_name: string;
  source_url: string;
  published_at: string;
}

/**
 * Phase 1 用的假資料。Phase 2 接 Supabase 之後改從 news 表 select,
 * 介面對齊 SPEC §B.2,讓元件層在 Phase 2 不用大改。
 */
export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'mock-1',
    slug: 'claude-opus-4-7',
    title: 'Anthropic 釋出 Claude Opus 4.7,把 agentic 編碼推到新高',
    summary:
      'Opus 4.7 在 SWE-bench Verified 拿到 82.4%、在 Terminal-Bench 提升 14 個百分點;新加入的 fast mode 把延遲砍半,適合互動式工作。',
    category: 'ai',
    source_name: 'Anthropic Blog',
    source_url: 'https://www.anthropic.com/news',
    published_at: '2026-04-26T09:00:00+08:00',
  },
  {
    id: 'mock-2',
    slug: 'next-16-released',
    title: 'Next.js 16 GA:Turbopack 預設、async params、metadata revalidate',
    summary:
      '官方預設啟用 Turbopack,build 時間平均砍 60%;route segment 的 params/searchParams 全面 async,並支援 metadata 級別的 revalidate.',
    category: 'tools',
    source_name: 'Vercel',
    source_url: 'https://nextjs.org/blog',
    published_at: '2026-04-24T22:30:00+08:00',
  },
  {
    id: 'mock-3',
    slug: 'tailwind-v4-stable',
    title: 'Tailwind CSS v4 穩定版到位,@theme 取代 tailwind.config.ts',
    summary:
      'v4 把所有 token 搬進 CSS 的 @theme directive,build 時間從 800ms 降到 70ms,並原生支援 @container query 與 oklch 色票。',
    category: 'tools',
    source_name: 'Tailwind Labs',
    source_url: 'https://tailwindcss.com/blog',
    published_at: '2026-04-22T18:00:00+08:00',
  },
  {
    id: 'mock-4',
    slug: 'geo-spec-v0-3',
    title: 'GEO 工作小組釋出 v0.3 規範,新增 LLM citation schema',
    summary:
      '生成引擎優化(GEO)社群推動的 schema.org 擴充進入 v0.3,定義了 llm-citation、ai-policy 兩個新 type,主要瀏覽器與爬蟲已表態跟進。',
    category: 'ai',
    source_name: 'W3C Community',
    source_url: 'https://www.w3.org',
    published_at: '2026-04-20T11:15:00+08:00',
  },
  {
    id: 'mock-5',
    slug: 'sora-3-text-control',
    title: 'OpenAI Sora 3 釋出 text-to-control,影片可逐 frame 改 prompt',
    summary:
      '新模型支援把每個 frame 當成獨立 prompt 改寫,風格、人物、場景都能在同一段影片裡無縫切換,實測延遲降到 12s/秒.',
    category: 'ai',
    source_name: 'OpenAI',
    source_url: 'https://openai.com/blog',
    published_at: '2026-04-18T01:45:00+08:00',
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  ai: 'AI',
  crypto: 'Crypto',
  tools: 'Tools',
  paper: 'Paper',
};
