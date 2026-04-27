-- ============================================================================
-- SatoriAI Lab — seed data
--
-- 用法:0001_init.sql 跑完之後,把這個檔案貼到 SQL Editor 跑。
-- on conflict do nothing → 重跑安全。
-- ============================================================================

insert into public.tools
  (slug, name, tagline, description, github_repo, homepage_url, language,
   category, status, featured, sort_order, install, problem_statement)
values
  (
    'geofix',
    'geofix.xyz',
    'GEO 分析優化工具,讓 LLM 看見你的內容',
    'geofix 是一套 Generative Engine Optimization(GEO)工作流,幫品牌與創作者用最少手動工作量,把網站內容調整到 LLM 能正確抓取、引用、推薦。內建 20+ 條檢測規則(canonical、language tag、structured data、AI crawler 政策、entity coverage…),產出可執行的修正清單。',
    'satoriai-lab/geofix',
    'https://geofix.xyz',
    'TypeScript',
    'AI Tools',
    'active',
    true,
    1,
    'npx geofix init',
    '傳統 SEO 工具假設讀者是搜尋引擎爬蟲,但 LLM(Claude / ChatGPT / Perplexity)讀網頁的方式不同 — 它們會丟掉 client-rendered 內容、忽略沒有 schema.org markup 的段落、優先引用結構清晰的列表式資料。geofix 把這些經驗整理成可重複的檢測,讓你不需要每天追文獻也能維持 GEO 健康。'
  ),
  (
    'satori-ingest',
    'Satori Ingest',
    'AI 新聞聚合器,推到任何你需要的地方',
    'Satori Ingest 是 SatoriAI Lab 自用的新聞抓取與摘要管線。每 15 分鐘掃 150+ 個來源(官方部落格、X、論文 RSS、GitHub release),用 LLM 判斷重要性 + 寫成 2 句中文摘要,然後 push 到 SatoriAI 網站、Discord 與 LINE。Phase 2 會開源 webhook 介面,讓任何網站都能接成自己的 News 流。',
    'satoriai-lab/satori-ingest',
    null,
    'Python',
    'AI Tools',
    'beta',
    true,
    2,
    'pip install satori-ingest',
    'AI 新聞分散在 Twitter / 部落格 / arXiv / Discord 之間,單點訂閱漏訊息,RSS reader 又把所有來源平等對待。Satori Ingest 幫你做兩件事:把噪音過濾掉(LLM 評分 + 去重),以及把訊號 push 到你已經會看的地方(網站 / 聊天工具),不必再多開一個 app。'
  ),
  (
    'prompt-tuner',
    'Prompt Tuner',
    '把一段 prompt 做 A/B,看哪個版本真的比較好',
    'Prompt Tuner 是給 builder 用的 prompt 評測工作台:把 baseline prompt 跟你想試的變體一起跑同一組 test case,模型回應自動 diff、自動評分(rubric LLM judge + cost / latency)、把結果存成 markdown report 釘在 repo 裡,讓 prompt 跟 code 一樣有 git history 可以追。',
    'satoriai-lab/prompt-tuner',
    null,
    'TypeScript',
    'AI Tools',
    'coming-soon',
    true,
    3,
    'npx prompt-tuner init',
    '改 prompt 到目前為止還是非常憑感覺 — 沒人比較變體的真實效果差距,沒人記錄為什麼某個版本被選中。等你回頭想問「我們上一次調 system prompt 是什麼時候、為什麼?」,只剩 Slack 訊息可以翻。Prompt Tuner 把這流程結構化、可重複,並且輸出成可以 commit 的 artifact。'
  )
on conflict (slug) do nothing;
