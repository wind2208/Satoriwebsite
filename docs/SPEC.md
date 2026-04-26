# SatoriAI Lab 網站 — 完整產品規格

本文件涵蓋全部四個 phase 的架構與規格。Phase 1 的具體任務見 `PHASE_1_TASKS.md`。

---

## A. 系統架構

```
┌─────────────────┐         ┌──────────────────────┐
│  News Bot       │  POST   │  /api/news/ingest    │
│ (使用者另一個    │ ──────▶ │  (verify HMAC)        │
│  軟體)          │         │  ↓                    │
└─────────────────┘         │  Supabase: news 表    │
                            └──────────┬───────────┘
                                       │ Realtime
                                       ▼
┌─────────────────────────────────────────────────────┐
│  Next.js (Vercel)                                    │
│  ├─ Server Components 從 Supabase 讀取               │
│  ├─ /news realtime channel(client subscription)     │
│  ├─ /rss.xml 從 news 表渲染                          │
│  ├─ /api/subscribe → Resend audience + Supabase 表   │
│  └─ Cron(Vercel Cron)→ Resend digest send           │
└─────────────────────────────────────────────────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │  Resend             │
                            │  (transactional +   │
                            │   weekly digest)    │
                            └─────────────────────┘
```

關鍵原則:
- **單一資料源** = Supabase 的 `news` 表。網站、RSS、email digest 全都從這裡派生
- 新聞軟體只負責「寫入 Supabase」,不需要知道網站存在
- 網站對新聞的更新走 Realtime,不 polling

---

## B. 資料模型(Supabase / Postgres)

### B.1 `tools`(工具)

```sql
create table tools (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,           -- 'geofix', 'wallet-watch'
  name          text not null,                  -- 'geofix.xyz'
  tagline       text not null,                  -- 一句話定位(顯示在卡片)
  description   text,                           -- 詳情頁長描述(MDX 在 content/)
  github_repo   text,                           -- 'satoriai-lab/geofix'
  homepage_url  text,                           -- 'https://geofix.xyz'
  language      text,                           -- 'TypeScript'
  category      text,                           -- 'AI Tools' | 'Blockchain' | ...
  cover_image   text,                           -- storage path
  status        text default 'active',          -- active | beta | archived
  featured      boolean default false,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index tools_featured_idx on tools(featured, sort_order);
```

GitHub stars 不存進 DB — 走 server component + 1hr revalidate fetch。

### B.2 `news`(新聞)

```sql
create table news (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,           -- auto-generated from title
  title         text not null,
  summary       text,                           -- 2-3 句摘要
  content       text,                           -- 完整內容(markdown)
  source_url    text,                           -- 原始來源
  source_name   text,                           -- 'Anthropic Blog' / 'X / @sama'
  category      text,                           -- 'ai' | 'crypto' | 'tools' | 'paper'
  tags          text[] default '{}',
  cover_image   text,
  published_at  timestamptz not null default now(),
  created_at    timestamptz default now(),
  ingest_source text,                           -- 'webhook' | 'manual' | 'rss'
  external_id   text                            -- 來自軟體的去重 key
);

create unique index news_external_id_idx on news(ingest_source, external_id)
  where external_id is not null;
create index news_published_idx on news(published_at desc);
create index news_category_idx on news(category, published_at desc);
```

### B.3 `subscribers`(訂閱者)

```sql
create table subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  status        text default 'pending',         -- pending | active | unsubscribed
  channels      text[] default '{email}',       -- email | rss(RSS 不需註冊但留位)
  topics        text[] default '{ai}',          -- 訂閱類別
  confirm_token text,                            -- double opt-in
  confirmed_at  timestamptz,
  source        text,                            -- 'home_cta' | 'footer' | 'tool_page'
  created_at    timestamptz default now(),
  unsubscribed_at timestamptz
);
```

### B.4 RLS(Row Level Security)

- `tools`、`news`:public read(anon role 可 select),只有 service role 可寫
- `subscribers`:anon 可 insert(訂閱),不能 select 或 update,只有 service role 全權

---

## C. 頁面規格

### C.1 Home `/`

區塊順序(由上而下):

1. **Header**(sticky):logo、nav(Tools / News / About)、訂閱按鈕
2. **Hero**:
   - 上方 caption:`SATORI · AI · LAB`(uppercase, letter-spacing)
   - 大標題:「把 AI 算力,變成『現實生產力』」(display 字級,可拆兩行)
   - 副標:一句說明
   - CTA:[ 瀏覽工具 ](primary) [ 訂閱新聞 ](secondary)
   - 背景:`radial-gradient(circle at 50% 0%, var(--accent-glow), transparent 60%)`
3. **Featured Tools**:3 張卡片,顯示 name / tagline / GitHub stars / 語言
4. **Latest News**:5 條最新新聞(time + title + category badge)+「查看全部 →」
5. **Subscribe CTA**:標題 + email input + 訂閱按鈕 + 「也提供 RSS」
6. **Footer**:Logo + nav + social(YouTube / X / GitHub)+ copyright

### C.2 `/tools`

- 區塊標題 + 簡介
- 工具卡片網格(`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- 可選:依 category 篩選(Phase 2)

### C.3 `/tools/[slug]`

- Breadcrumb(Tools / 工具名)
- Hero 區:封面圖 + 名稱 + tagline + CTA(GitHub / Live demo / 安裝指令複製)
- 「為什麼有這個工具」section(MDX 內容)
- 安裝/使用 section(code block + copy button)
- Live stats:GitHub stars / latest release / open issues(server component)
- Related tools(同 category 的其他工具)

### C.4 `/news`

- 標題 + RSS / Email 訂閱連結
- 新聞列表(每筆:時間、category、title、summary)
- 篩選:category tabs
- Phase 2:Realtime 新項目從上方滑入

### C.5 `/news/[slug]`

- 時間 + category + title
- 來源連結
- 內文(markdown 渲染)
- 「上一則 / 下一則」
- 「訂閱以收到類似新聞」inline CTA

### C.6 `/about`

- 個人/實驗室故事(MDX)
- 為什麼做這個網站
- 連結:YouTube / X / Linktree / Email

---

## D. API 設計

### D.1 `POST /api/news/ingest`

新聞軟體推送新聞用。

```http
POST /api/news/ingest
Content-Type: application/json
X-Ingest-Token: <NEWS_INGEST_SECRET>
X-Idempotency-Key: <external_id>

{
  "title": "...",
  "summary": "...",
  "content": "...",                    // optional, markdown
  "source_url": "https://...",
  "source_name": "Anthropic Blog",
  "category": "ai",
  "tags": ["claude", "agentic"],
  "cover_image": "https://...",        // optional
  "published_at": "2026-04-26T10:00:00Z",
  "external_id": "anthropic-2026-04-26-claude46"
}
```

驗證:
- Header `X-Ingest-Token` 必須等於 `NEWS_INGEST_SECRET`
- 用 `external_id` 去重(unique index)
- title / source_url / category 必填,其他可選

回應:
- 201 + 新建的 news row(含 slug)
- 200 + existing row(去重命中時)
- 401 token 不對
- 422 欄位錯誤

### D.2 `POST /api/subscribe`

```http
POST /api/subscribe
Content-Type: application/json

{ "email": "user@example.com", "source": "home_cta", "topics": ["ai"] }
```

流程:
1. validate email
2. insert into `subscribers` with `status='pending'` + `confirm_token`
3. send confirmation email via Resend(template: `confirm.tsx`)
4. 點 link 後 GET `/api/subscribe/confirm?token=...` → status='active'

回應:200 OK 不論 email 是否已存在(避免 enumeration 攻擊)。

### D.3 `GET /rss.xml`

從 `news` 表最新 50 條渲染 RSS 2.0 / Atom。`Cache-Control: public, s-maxage=300, stale-while-revalidate=3600`。

### D.4 `GET /api/og?title=...&category=...`

動態生成 OG image(1200×630)。用 `@vercel/og`。

---

## E. Email Template(Resend + react-email)

| Template | 觸發 | 內容 |
|----------|------|------|
| confirm | 訂閱請求 | 雙重確認連結 |
| welcome | 確認後 | 歡迎、設定偏好、最新一條精選 |
| digest-weekly | Cron 每週 | 過去 7 天 top 5 新聞 + 工具更新 |
| unsubscribed | 取消訂閱後 | 確認 + 5 秒問卷 |

所有 email 用 `react-email` 寫,放在 `emails/` 目錄,測試用 `pnpm email dev`。

---

## F. Phase 規劃

### Phase 1 — MVP(獨立完整,不需 Supabase)

目標:把 hero / tools / about 上線,工具用 file-based 資料(MDX 或 JSON in `content/`),新聞用 hardcoded 假資料。

詳細任務見 `PHASE_1_TASKS.md`。

驗收:Lighthouse Perf ≥ 90、Acc ≥ 95、SEO ≥ 95;Vercel 部署成功;3 個 breakpoint 都好看。

### Phase 2 — 內容流(接 Supabase)

1. Supabase 專案建立、跑上方 schema migration
2. `tools` 從 file 改 fetch Supabase
3. `news` 完整 CRUD + `/news` 頁
4. `/api/news/ingest` webhook(含 HMAC 驗證、idempotency)
5. RSS feed
6. `/news` 頁的 Realtime 訂閱(新項目從上方滑入)

驗收:用 curl POST 一條新聞 → 5 秒內出現在 `/news`;RSS 在 reader 中能訂到;ingest endpoint 401 / 422 / 重複 都行為正確。

### Phase 3 — 訂閱(Resend)

1. Resend 帳號 + 驗證 domain
2. `subscribers` 表 + RLS
3. `/api/subscribe` + double opt-in
4. confirm / welcome / unsubscribe 三個 email template
5. Vercel Cron(每週日早 9 點台灣時間)觸發 digest
6. `/preferences` 頁:讓訂閱者改 topic / 取消訂閱

驗收:從 0 到收到 confirm 信 < 30 秒;退訂連結點下去立即生效;digest 排版手機/桌面都不爛。

### Phase 4 — 打磨

1. Plausible / Umami 接好
2. OG image 動態生成
3. 細部動效(framer-motion 用在 hero 跟 reveal)
4. 404 / 500 頁面
5. SEO:hreflang(若有英文版)、structured data(`Article` schema)
6. (Optional)LINE Bot:LINE Official Account + webhook 接 Supabase trigger

---

## G. 安全與運維

- **Secrets** 全部走 Vercel env,不進 git(`.env.example` 才進)
- **Rate limit** ingest endpoint(用 Upstash Redis 或 Vercel Edge Config)
- **CSP**:`script-src 'self' plausible.io`
- **備份**:Supabase 的 PITR 留 7 天就夠
- **錯誤監控**:Sentry(Phase 4 加)

---

## H. 測試策略

- Phase 1:Playwright e2e 至少跑 home / tools / single tool 三條 happy path
- Phase 2:ingest endpoint 的 unit test(token 驗證、去重、欄位驗證)
- Phase 3:Resend webhook handler 的 unit test
- 不追求 100% coverage,追求關鍵路徑覆蓋

---

## I. 非目標(明確不做)

- 多語系(目前只做繁體中文,英文版等需求出現再說)
- 評論系統
- 使用者註冊登入(訂閱不算)
- 工具的 in-browser playground(嵌入 GitHub Codespaces 或 StackBlitz 為止)
- 付費訂閱層級
- 留言版 / 社群

如果 Claude Code 認為某個非目標應該被加進來,先說理由不要直接動手。
