-- ============================================================================
-- SatoriAI Lab — Phase 2 initial schema
-- 對應 docs/SPEC.md §B(Data Model)
--
-- 跑法:把整個檔案內容貼到 Supabase Dashboard → SQL Editor → New query → Run
-- 設計前提:project 建立時 "Automatically expose new tables" 取消勾、
--          "Enable automatic RLS" 勾選 → 所以新 table 預設完全鎖死,
--          要顯式 grant + create policy 才開放。
-- ============================================================================

-- ── tools ─────────────────────────────────────────────────────────────────
create table if not exists public.tools (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  tagline           text not null,
  description       text,
  github_repo       text,
  homepage_url      text,
  language          text,
  category          text,
  cover_image       text,
  status            text not null default 'active'
                    check (status in ('active','beta','coming-soon','archived')),
  featured          boolean not null default false,
  sort_order        int not null default 0,
  install           text,
  problem_statement text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists tools_featured_idx on public.tools (featured, sort_order);
create index if not exists tools_category_idx on public.tools (category);

-- 自動更新 updated_at 觸發器
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists tools_updated_at on public.tools;
create trigger tools_updated_at
  before update on public.tools
  for each row execute function public.set_updated_at();

-- ── news ──────────────────────────────────────────────────────────────────
create table if not exists public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  summary       text,
  content       text,
  source_url    text,
  source_name   text,
  category      text,
  tags          text[] not null default '{}',
  cover_image   text,
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  ingest_source text,
  external_id   text
);

-- 同一個來源同一個 external_id 不能重覆 — webhook idempotency
create unique index if not exists news_external_id_idx
  on public.news (ingest_source, external_id)
  where external_id is not null;

create index if not exists news_published_idx on public.news (published_at desc);
create index if not exists news_category_idx  on public.news (category, published_at desc);

-- ── subscribers ───────────────────────────────────────────────────────────
create table if not exists public.subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  status          text not null default 'pending'
                  check (status in ('pending','active','unsubscribed')),
  channels        text[] not null default '{email}',
  topics          text[] not null default '{ai}',
  confirm_token   text,
  confirmed_at    timestamptz,
  source          text,
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists subscribers_status_idx on public.subscribers (status);

-- ── Row Level Security ────────────────────────────────────────────────────
-- automatic-RLS 已經把 RLS 啟動了,這幾行是保險(idempotent)
alter table public.tools       enable row level security;
alter table public.news        enable row level security;
alter table public.subscribers enable row level security;

-- tools / news 對所有人(含未登入)開放 SELECT
drop policy if exists "tools are publicly readable" on public.tools;
create policy "tools are publicly readable" on public.tools
  for select to anon, authenticated using (true);

drop policy if exists "news is publicly readable" on public.news;
create policy "news is publicly readable" on public.news
  for select to anon, authenticated using (true);

-- subscribers 只允許 anon INSERT(訂閱表單),不能 SELECT / UPDATE
-- service_role 不受 RLS 限制,所以 confirm / unsubscribe 走 server route + admin client
drop policy if exists "anyone can subscribe" on public.subscribers;
create policy "anyone can subscribe" on public.subscribers
  for insert to anon, authenticated with check (true);

-- ── GRANTs(autoexpose 關掉所以要顯式給) ─────────────────────────────────
grant usage on schema public to anon, authenticated;
grant select on public.tools to anon, authenticated;
grant select on public.news  to anon, authenticated;
grant insert on public.subscribers to anon, authenticated;

-- ── Realtime ──────────────────────────────────────────────────────────────
-- 把 news 表加進 realtime publication,讓 client 可以訂閱新筆資料
alter publication supabase_realtime add table public.news;
