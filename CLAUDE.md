# SatoriAI Lab — 官方網站

> 把 AI 算力,變成「現實生產力」

這份文件是給 Claude Code 看的:每次開新 session 時請先讀這份檔案再開始工作。如果指令跟這份文件衝突,以這份文件為準,並在動工前先指出衝突。

---

## 1. 專案概述

| 項目 | 內容 |
|------|------|
| 品牌 | SatoriAI 實驗室 |
| 主要受眾 | 繁體中文(台灣為主)、技術人 + 內容創作者混合 |
| YouTube | @satoriai_lab(3,460 訂閱) |
| X (Twitter) | @LL830813(3,905 跟隨) |
| 既有產品 | geofix.xyz(GEO 分析優化工具) |
| 網站目的 | 1. 展示開源工具 2. 自動聚合 AI 新聞 + 訂閱 3. YouTube/X 的延伸入口 |

網站不是傳統公司官網。第一屏優先顯示「最新動態 + 主打工具」,讓人一眼看到「這站是活的」。

---

## 2. 技術棧(已決定,不要自行替換)

- **框架**:Next.js 14+(App Router)+ TypeScript(strict mode)
- **樣式**:Tailwind CSS + shadcn/ui
- **資料層**:Supabase(Postgres + Auth + Realtime + Storage)
- **Email**:Resend(搭配 react-email template)
- **部署**:Vercel
- **Analytics**:Plausible(後期再接)
- **Package manager**:pnpm
- **Node**:>= 20

如果某個套件理由充分(例如 shadcn/ui 預設依賴),可以加。但不要自己換掉框架/資料庫/email provider。

---

## 3. 品牌與設計系統

延續 YouTube banner 的「電影感深色 + 山景」氣質。原則:**留白 90%、動效 10%**。動效只放在 hero 區與 hover state。

### 3.1 色票

```
背景
  --bg-primary     #0A0E1A   主背景(near black with blue tint)
  --bg-secondary   #0F1422   次層(footer / 區塊分隔)
  --bg-card        #131826   卡片
  --bg-elevated    #1A2032   hover / 浮起態

邊線
  --border-subtle  rgba(255,255,255,0.06)
  --border-default rgba(255,255,255,0.10)
  --border-strong  rgba(255,255,255,0.18)

文字
  --text-primary   #FFFFFF
  --text-secondary #A8B5C7
  --text-tertiary  #6B8AB5
  --text-muted     #4A5A75

品牌色
  --accent         #3D7BCC   主強調(CTA、連結 hover、live dot)
  --accent-soft    #1E3A6F   弱強調(背景 glow、selected state)
  --accent-glow    rgba(61,123,204,0.18)  hero radial gradient

語意色(極少用)
  --success        #4ADE80
  --warning        #F59E0B
  --danger         #EF4444
```

### 3.2 字體

```
Sans (中文)  Noto Sans TC      400 / 500 / 600
Sans (英文)  Inter             400 / 500 / 600
Mono         JetBrains Mono    400 / 500
Display      用於 hero 大標題,可選 Cormorant Garamond Italic 或保留 Logo cursive 風的字
```

字級階(rem 制,基準 16px):

| Token | px | line-height | 用途 |
|-------|-----|-------------|------|
| display | 56 | 1.1 | Hero 唯一大標題 |
| h1 | 32 | 1.25 | Page title |
| h2 | 22 | 1.35 | Section heading |
| h3 | 16 | 1.4 | Card title |
| body | 15 | 1.7 | 內文 |
| small | 13 | 1.6 | 輔助文字 |
| caption | 11 | 1.4 | uppercase + letter-spacing 0.18em(SECTION · LABEL) |

### 3.3 間距與圓角

- 間距基準 4px。常用:8 / 12 / 16 / 20 / 24 / 32 / 48 / 64 / 96 / 128
- 圓角:`sm 6px`(button/badge)、`md 8px`(card)、`lg 12px`(large card)、`xl 16px`(hero panel)

### 3.4 動效原則

- Page transition:**沒有**。讓網站感覺像 product 不像作品集
- Hover:邊線顏色從 `--border-subtle` → `--border-default`(150ms ease)
- Hero glow:`radial-gradient(circle at 50% 0%, var(--accent-glow), transparent 60%)`
- 載入動畫:用骨架屏(skeleton)而不是 spinner
- Scroll reveal:可用 `framer-motion` 但要克制,只用在 hero 跟 section heading

### 3.5 Layout

- Container 最大寬 1200px,padding-x:`px-6 md:px-8 lg:px-12`
- 區塊間距:`py-20 md:py-32`
- 卡片內距:`p-6 md:p-8`

---

## 4. 目錄結構

```
src/
├── app/
│   ├── layout.tsx              # 全站 layout、字體、metadata
│   ├── page.tsx                # Home
│   ├── globals.css
│   ├── tools/
│   │   ├── page.tsx            # 工具總覽
│   │   └── [slug]/page.tsx     # 工具詳情
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── about/page.tsx
│   ├── api/
│   │   ├── news/ingest/route.ts    # 新聞軟體 webhook
│   │   ├── subscribe/route.ts      # 訂閱
│   │   └── og/route.tsx            # 動態 OG image
│   ├── rss.xml/route.ts            # RSS feed
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                     # shadcn/ui (button, input, card...)
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── container.tsx
│   ├── home/
│   │   ├── hero.tsx
│   │   ├── tools-section.tsx
│   │   ├── news-section.tsx
│   │   └── subscribe-cta.tsx
│   ├── tool-card.tsx
│   ├── news-item.tsx
│   └── section-heading.tsx
├── content/
│   └── tools/                  # MDX 或 JSON 形式的工具元資料
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # browser client
│   │   ├── server.ts           # server client
│   │   └── types.ts            # 從 db schema 自動產生
│   ├── github.ts               # 抓 repo stats(stars / release)
│   ├── resend.ts
│   └── utils.ts
├── styles/
│   └── tokens.css              # CSS 變數(對應 §3.1)
└── types/
    └── index.ts
```

---

## 5. 程式碼規範

1. **TypeScript strict** 全開,不允許 `any`(除非註解 `// eslint-disable-next-line` 並寫原因)
2. **預設 Server Component**,需要互動才標 `'use client'`
3. **Tailwind only**,不寫 CSS modules、不寫 styled-components(globals.css 跟 tokens.css 除外)
4. **shadcn/ui** component 一律放 `components/ui/`,不要修改原始檔(如要客製化,複製出來改)
5. **Image** 一律用 `next/image`,SVG 用 `lucide-react` 或 inline `<svg>`
6. **字串**:UI 文案用繁體中文 + 全形標點;程式碼註解、commit 用英文
7. **檔名**:component 用 `kebab-case.tsx`,export 用 `PascalCase`
8. **Import 順序**:react/next → 第三方 → `@/` 內部 → 相對路徑 → 樣式

---

## 6. 環境變數

`.env.local`(不進 git):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@satoriai.lab

# News ingestion
NEWS_INGEST_SECRET=

# GitHub (拉 repo stats,匿名 token 也行)
GITHUB_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=https://satoriai.lab
```

提交一份 `.env.example`(空值)到 git。

---

## 7. 常用指令

```bash
pnpm dev                  # 本機開發
pnpm build                # production build
pnpm lint                 # eslint
pnpm typecheck            # tsc --noEmit
pnpm format               # prettier
pnpm shadcn add <name>    # 新增 shadcn/ui component
pnpm db:types             # 從 Supabase 產生 TypeScript types
```

`package.json` 必須有上面這些 script。

---

## 8. 不可違背的約束

1. **首頁第一屏不放公司介紹**,放 hero(品牌 statement)+ 主打工具或最新新聞
2. **工具卡片必須顯示 GitHub stars**(server component + 1 hr revalidate)
3. **新聞流要支援 Realtime 更新**(Supabase channel,不靠 polling)
4. **每個 page 都要有正確的 OpenGraph + Twitter card meta + canonical URL**
5. **不做 page transition / route animation**
6. **Hero 是唯一可以「視覺發揮」的區塊**,其他區塊保持冷靜俐落
7. **Mobile first**:在 375 / 768 / 1280 三個 breakpoint 都要好看
8. **Lighthouse**:Performance ≥ 90、Accessibility ≥ 95、SEO ≥ 95(production 必達)
9. **不要自動加 emoji**,除非設計稿明確標示

---

## 9. 工作流程

每次接到一個 task:

1. 先讀 `docs/SPEC.md` 找到對應段落
2. 規劃變更檔案清單,如果超過 5 個檔案先說明計畫再動工
3. 動工後跑 `pnpm lint && pnpm typecheck`
4. 結束時用一句話總結改了什麼、為什麼

如果遇到 spec 沒寫的決策(例如某個 component 的具體 padding),套用本文 §3 的設計系統作為預設,別問太細的問題拖慢進度。但若涉及架構選擇(換套件、加新表),先問再做。

---

## 10. Phase 路線圖速覽

| Phase | 內容 | 預期時間 |
|-------|------|---------|
| 1 | MVP — Home / Tools / About + 設計系統 + SEO + 部署 | 1–2 週 |
| 2 | Supabase 串接 + News 流 + RSS + Realtime | 1 週 |
| 3 | Email 訂閱(Resend)+ Welcome + Weekly digest | 3–5 天 |
| 4 | 打磨 + Analytics + (Optional) LINE Bot | 持續 |

詳細任務見 `docs/PHASE_1_TASKS.md` 等。
