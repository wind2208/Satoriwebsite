# Claude Code 啟動提示

把以下整段貼進 Claude Code(在你的專案根目錄)。

---

## 第一次開工 prompt

```
請先完整讀過 CLAUDE.md、docs/SPEC.md、docs/PHASE_1_TASKS.md 三份檔案,然後依序執行 Phase 1 的 Task 1–11。

執行原則:
1. 每個 Task 開始前用一句話說明你要做什麼,結束時用一句話總結。
2. CLAUDE.md §3 的設計系統是不可違背的。如果有 component 規格不清楚,套用設計系統作為預設,別問。
3. 但若涉及「換套件、加新表、新增非目標範圍的功能」,先停下來問。
4. 每完成 2–3 個 Task,跑一次 `pnpm lint && pnpm typecheck`,確保沒回歸錯誤再繼續。
5. Task 9(部署)需要我給你 GitHub repo 跟 Vercel,做到 Task 8 結束時停下來等我。
6. 不要主動加 emoji、不要做 page transition、不要寫 CSS modules。

開始 Task 1。
```

---

## 過程中常用的後續 prompt

### 進度確認

```
列出目前完成到哪個 Task,還有什麼 blocking 我需要決定的。
```

### 設計微調

```
首頁 hero 看起來太空,參考 linear.app 跟 vercel.com 的 hero,在不違背 CLAUDE.md §3 設計系統的前提下調整。
```

### 加新工具

```
在 src/content/tools/ 新增一個工具:
- slug: <slug>
- name: <name>
- tagline: <tagline>
- githubRepo: <owner/repo>
- 其他欄位請依 SPEC.md §B.1 補齊預設值

完成後在 /tools 跟 /tools/<slug> 都驗證能渲染。
```

### Phase 切換

完成 Phase 1 並上線後,給:

```
Phase 1 已部署。請讀 docs/SPEC.md §F.Phase 2,擬一份 docs/PHASE_2_TASKS.md(格式參考 PHASE_1_TASKS.md),寫完讓我審過再執行。
```

---

## 我自己要先準備的東西

開工前手動處理(Claude Code 沒辦法幫你的):

1. **GitHub repo**:建一個 `satoriai-lab/website`(或你想的名字)的空 repo,把 token 拿到
2. **Vercel 帳號**:登入並連 GitHub
3. **域名**:決定要用 satoriai.lab、lab.satoriai.xyz 還是其他;先在 Vercel 直接拿 `*.vercel.app` 也行
4. **GitHub Personal Access Token**:給網站匿名 fetch repo stats 用(`public_repo` scope 就夠),寫進 Vercel env
5. **Logo 檔案**:把現有的腦袋 logo 切一份 SVG 跟 PNG(透明底)放進 `public/brand/` — Claude Code 會用到
6. **品牌封面圖**:YouTube banner 那張可以放進 `public/brand/cover.jpg`,Phase 1 OG image 會用到

到 Phase 2 之前再準備:
- Supabase 專案
- 你那個新聞軟體要怎麼接(前面那題等你評估完告訴我)

到 Phase 3 之前再準備:
- Resend 帳號 + 驗證寄件 domain
