## Why

目前 Pocketit 漫畫收藏完全依賴 LocalStorage，資料無法跨裝置同步，搜尋功能也僅限本地關鍵字篩選。要成為一個有競爭力的收藏管理工具，需要：

1. **資料雲端化**：引入後端服務（FastAPI + PostgreSQL），資料持久化至資料庫，支援未來多裝置同步。
2. **外部搜尋整合**：串接 MyAnimeList、TMDB、Google Books，讓使用者直接搜尋真實作品並加入收藏，取代純手動輸入。
3. **Monorepo 架構**：前後端統一在同一個 repo 管理，降低開發協作複雜度。
4. **使用者驗證**：收藏資料與帳號綁定，為多裝置同步做基礎建設。

## What Changes

- 專案重構為 monorepo：現有前端移入 `frontend/`，新建 `backend/`（FastAPI + Python）
- 新建後端 REST API，取代前端直接操作 LocalStorage
- 新增外部搜尋功能，串接三個第三方資料來源
- 新增基本 JWT 使用者驗證（register/login）
- manga-collection spec 升級：資料持久化從 LocalStorage 改為後端 API，並新增「從搜尋結果加入收藏」流程

## Impact

- **前端**：API 呼叫層取代 LocalStorage 操作，需加入 React Query 或 SWR 處理非同步狀態
- **後端**：全新服務，需部署環境（開發用本地 uvicorn，正式用 Docker）
- **資料**：現有 LocalStorage 收藏資料需手動匯出或在初次登入時遷移
- **環境變數**：需申請 MyAnimeList Client ID、TMDB API Key、Google Books API Key
