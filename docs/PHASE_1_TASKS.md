# Phase 1 — MVP 任務清單

目標:把 SatoriAI Lab 官網上線,Hero + 工具展示 + About + SEO + 部署。
不接 Supabase、不做訂閱表單後端 — 訂閱按鈕暫時用 mailto 或 disabled state,新聞區塊用 hardcoded 假資料。

完成定義:Vercel 上線網址在 3 個 breakpoint(375 / 768 / 1280)都好看,Lighthouse Performance ≥ 90、Accessibility ≥ 95、SEO ≥ 95。

---

## Task 1 — 專案 scaffold

```bash
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

額外安裝:

```bash
pnpm add lucide-react clsx tailwind-merge class-variance-authority
pnpm add -D prettier prettier-plugin-tailwindcss @types/node
```

設定:
- `tsconfig.json` 開啟 `"strict": true`
- 加 `package.json` script:`typecheck: "tsc --noEmit"`、`format: "prettier --write ."`
- 建 `.prettierrc.json` 用 `prettier-plugin-tailwindcss`
- 建 `.env.example`

驗收:`pnpm dev` 跑得起來,`pnpm lint && pnpm typecheck` 通過。

---

## Task 2 — 設計系統實作

### 2.1 Tailwind config(`tailwind.config.ts`)

把 CLAUDE.md §3 的色票、字級、間距都映射成 Tailwind theme tokens:

```ts
theme: {
  extend: {
    colors: {
      bg: {
        primary: '#0A0E1A',
        secondary: '#0F1422',
        card: '#131826',
        elevated: '#1A2032',
      },
      border: {
        subtle: 'rgba(255,255,255,0.06)',
        default: 'rgba(255,255,255,0.10)',
        strong: 'rgba(255,255,255,0.18)',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#A8B5C7',
        tertiary: '#6B8AB5',
        muted: '#4A5A75',
      },
      accent: {
        DEFAULT: '#3D7BCC',
        soft: '#1E3A6F',
      },
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'var(--font-noto-tc)', 'system-ui'],
      mono: ['var(--font-jetbrains)', 'monospace'],
    },
    fontSize: {
      caption: ['11px', { lineHeight: '1.4', letterSpacing: '0.18em' }],
      small: ['13px', { lineHeight: '1.6' }],
      body: ['15px', { lineHeight: '1.7' }],
      h3: ['16px', { lineHeight: '1.4', fontWeight: '500' }],
      h2: ['22px', { lineHeight: '1.35', fontWeight: '500' }],
      h1: ['32px', { lineHeight: '1.25', fontWeight: '500' }],
      display: ['56px', { lineHeight: '1.1', fontWeight: '500' }],
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
  },
}
```

### 2.2 Global styles(`src/app/globals.css`)

- 設定 `body` 為 `bg-bg-primary text-text-primary font-sans`
- selection 顏色用 accent
- focus-visible 用 accent 1px outline + 2px offset

### 2.3 字體(`src/app/layout.tsx`)

```ts
import { Inter, Noto_Sans_TC, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoTC = Noto_Sans_TC({ subsets: ['latin'], variable: '--font-noto-tc', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });
```

### 2.4 shadcn/ui 安裝

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input separator badge card
```

選 dark theme 預設。

驗收:有一個 `/` 頁面顯示「SatoriAI Lab」用 display 字級,背景是深藍黑,字是白色,用 button component 看起來合理。

---

## Task 3 — Layout 組件

### 3.1 `components/layout/container.tsx`

```tsx
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-12', className)}>{children}</div>;
}
```

### 3.2 `components/layout/header.tsx`

- Sticky top, `bg-bg-primary/80 backdrop-blur` + bottom border subtle
- Logo:左側 `S` 圓形 + 「SatoriAI Lab」(15px / 500)
- Nav:Tools / News / About(13px / secondary,hover 變 primary)
- 右側:[ 訂閱 ] button(secondary outline)
- Mobile:漢堡選單,點開 slide-down

### 3.3 `components/layout/footer.tsx`

- 兩欄:左 logo + tagline,右四欄連結(Site / Tools / News / Social)
- 底部:© 2026 SatoriAI Lab + 一句 quote
- Social icons:YouTube / X / GitHub(用 `lucide-react` 的 `Youtube`、`Github`、自訂 X svg)

驗收:刷新任何頁面 header / footer 出現位置正確,mobile 選單開合正常。

---

## Task 4 — 工具資料層(file-based)

新增 `src/content/tools/`,每個工具一個 mdx 或 json 檔。先用 JSON 簡單:

```json
// src/content/tools/geofix.json
{
  "slug": "geofix",
  "name": "geofix.xyz",
  "tagline": "GEO 分析優化工具",
  "description": "...一段 markdown...",
  "githubRepo": "satoriai-lab/geofix",
  "homepageUrl": "https://geofix.xyz",
  "language": "TypeScript",
  "category": "AI Tools",
  "featured": true,
  "sortOrder": 1,
  "install": "npx geofix init",
  "problemStatement": "..."
}
```

寫 `lib/tools.ts`:

```ts
export async function getAllTools(): Promise<Tool[]> { ... }
export async function getToolBySlug(slug: string): Promise<Tool | null> { ... }
export async function getFeaturedTools(limit = 3): Promise<Tool[]> { ... }
```

至少準備 3 個工具(geofix 是真的,另外 2 個可以是規劃中的 placeholder,清楚標註 `status: 'beta'` 或 `'coming-soon'`)。

驗收:`getAllTools()` 在 server component 中可呼叫,Type 正確。

---

## Task 5 — Home 頁面組件

### 5.1 `components/home/hero.tsx`

- Outer:`relative min-h-[640px] flex items-center justify-center overflow-hidden`
- Glow 層:`absolute inset-0` + radial-gradient inline style
- 內容:caption(`SATORI · AI · LAB`)+ display 字大標題(兩行)+ secondary 副標 + 兩個 CTA button
- 大標題的「現實生產力」用引號 「 」

### 5.2 `components/home/tools-section.tsx`

- 區塊上方:`<SectionHeading>` component(caption + h2)
- Grid:3 個 `<ToolCard>`
- 右上角「View all →」連到 `/tools`

### 5.3 `components/tool-card.tsx`

- `Link` 包整張卡
- bg-bg-card + border subtle + rounded-lg + p-6
- 上方:語言 badge + GitHub stars(server fetch with revalidate 3600)
- 中:name(h3 / 500)
- 下:tagline(small / secondary)
- hover:border 變 default、輕微 translate-y-[-2px](用 transition-all)

GitHub stars fetch:

```ts
// lib/github.ts
export async function getRepoStars(repo: string): Promise<number | null> {
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    next: { revalidate: 3600 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.stargazers_count;
}
```

### 5.4 `components/home/news-section.tsx`

Phase 1 用 hardcoded `MOCK_NEWS` array,結構對齊 `news` 表。每條:時間(用 `date-fns` 的 `formatDistanceToNow`)+ title + category badge。「查看全部 →」連 `/news`(Phase 2 才實作頁面,先放 placeholder 或 disabled)。

### 5.5 `components/home/subscribe-cta.tsx`

`bg-bg-secondary py-20`,中央:標題 + 副標 + email input + 訂閱 button。Phase 1 button onSubmit 顯示 `「我們正在準備訂閱系統,先 follow X 不迷路」` 並連 X。下方一行小字:「也支援 RSS:`/rss.xml`」(同樣是 placeholder)。

### 5.6 組起來:`src/app/page.tsx`

```tsx
export default async function HomePage() {
  const tools = await getFeaturedTools(3);
  return (
    <>
      <Hero />
      <ToolsSection tools={tools} />
      <NewsSection news={MOCK_NEWS} />
      <SubscribeCTA />
    </>
  );
}
```

驗收:刷新首頁,4 個區塊由上而下出現,Lighthouse mobile / desktop 都跑一次過 90 / 95 / 95。

---

## Task 6 — Tools 頁

### 6.1 `/tools` 列表頁

- Page header:caption + h1(「Tools」)+ 副標(一句說明)
- Grid 3 欄(mobile 1 欄、tablet 2 欄)
- 每個工具用同一個 `<ToolCard>`(可加 prop `variant="full"` 顯示更多資訊)

### 6.2 `/tools/[slug]` 詳情頁

- Breadcrumb:`Tools / {name}`
- Hero block:左圖右文字佈局(mobile 改上下),含名稱、tagline、CTA(GitHub 連結 / Live demo / 安裝指令)
- 「Why this exists」section:渲染 `problemStatement`(markdown)
- 「Install / Use」section:code block + copy button(用 lucide `Copy` icon,點擊改 `Check`)
- Live stats row:Stars / Latest release / Open issues(server component,3 個獨立 fetch)
- Bottom:Related tools(同 category 隨機 2 個)
- 用 `generateStaticParams` 預渲染所有工具
- `generateMetadata` 動態 title / description / OG image

驗收:`/tools/geofix` 完整渲染,所有外部連結正確,複製按鈕能複製。

---

## Task 7 — About 頁

`/about`:

- Page header(同上)
- MDX 內容(寫一份 placeholder,用品牌 statement「把 AI 算力變成現實生產力」展開 3–4 段)
- Connect section:卡片網格,YouTube / X / GitHub / Linktree / Email,各帶 logo + handle + 一句描述 + 外部連結

驗收:`/about` 渲染好,連結都對。

---

## Task 8 — SEO 與 Metadata

### 8.1 全站 metadata(`app/layout.tsx`)

```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://satoriai.lab'),
  title: {
    default: 'SatoriAI Lab — 把 AI 算力變成現實生產力',
    template: '%s · SatoriAI Lab',
  },
  description: '...',
  openGraph: { ..., locale: 'zh_TW' },
  twitter: { card: 'summary_large_image', site: '@LL830813' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};
```

### 8.2 `app/sitemap.ts`

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getAllTools();
  return [
    { url: '/', priority: 1 },
    { url: '/tools', priority: 0.8 },
    { url: '/about', priority: 0.5 },
    ...tools.map(t => ({ url: `/tools/${t.slug}`, priority: 0.7 })),
  ];
}
```

### 8.3 `app/robots.ts`

allow all,sitemap 指 `/sitemap.xml`。

### 8.4 OG image(可暫用靜態 1200×630 png 放 `public/og.png`)

Phase 4 再做動態。

驗收:用 https://www.opengraph.xyz/ 檢查 home / 一個工具頁,OG image 跟 title 都對。

---

## Task 9 — 部署到 Vercel

1. Push 到 GitHub repo `satoriai-lab/website`(public 或 private 看你)
2. Vercel import → 一鍵部署
3. 設環境變數:`GITHUB_TOKEN`、`NEXT_PUBLIC_SITE_URL=https://你的域名`
4. 自訂域名(`satoriai.lab` 或 `lab.satoriai.xyz` 或暫用 vercel.app subdomain)
5. 確認 production build 沒 error

驗收:production URL 開得起來,所有頁面 200,Lighthouse 達標。

---

## Task 10 — 驗證 checklist

跑過下面每一項,有不過的回頭修:

- [ ] `pnpm build` 沒 error / warning(warning 全部處理或註解原因)
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm lint` 0 errors
- [ ] Mobile(375px)、Tablet(768px)、Desktop(1280px)三個寬度首頁/tool 詳情/about 都好看
- [ ] Lighthouse(production URL,mobile preset):Perf ≥ 90、Acc ≥ 95、SEO ≥ 95
- [ ] 所有 button / link 都有正確的 hover / focus state
- [ ] 動效有 `prefers-reduced-motion` fallback
- [ ] OG image 在 X / Slack 預覽看起來對
- [ ] `/sitemap.xml`、`/robots.txt` 可開
- [ ] 沒有 console error(production build)

---

## Task 11 — 交付給人類審查

跑完上述,寫一份 100 字內的 PR / commit 描述,內容包含:

- 上線 URL
- Lighthouse 三項分數
- 還沒做的(Phase 2/3/4 內容)
- 任何過程中你覺得需要使用者決定的事情

完成。
