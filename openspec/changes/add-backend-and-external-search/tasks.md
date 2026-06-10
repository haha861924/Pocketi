## 1. Monorepo 重組
- [x] 1.1 在專案根目錄建立 `frontend/` 和 `backend/` 目錄
- [x] 1.2 將現有所有前端檔案移入 `frontend/`（src/, public/, index.html, package.json, vite.config.ts, tsconfig*.json, tailwind.config.js, postcss.config.js, eslint.config.js）
- [x] 1.3 更新 `frontend/package.json` 和 `frontend/vite.config.ts` 中的相對路徑
- [x] 1.4 更新根目錄 `README.md`，加入 monorepo 啟動說明
- [x] 1.5 驗證 `cd frontend && pnpm dev` 可正常啟動
- [x] 1.6 更新 `.gitignore` 加入 `backend/__pycache__`, `backend/venv`

## 2. 後端專案初始化
- [x] 2.1 建立 `backend/` 目錄結構（app/, migrations/, routers/, models/, schemas/）
- [x] 2.2 建立 `backend/requirements.txt`（fastapi, uvicorn, sqlalchemy, asyncpg, alembic, httpx, python-jose, passlib, python-decouple）
- [x] 2.3 建立 `backend/.env.example`（DATABASE_URL, SECRET_KEY, MAL_CLIENT_ID, TMDB_API_KEY, GOOGLE_BOOKS_API_KEY）
- [x] 2.4 建立 `backend/app/main.py`（FastAPI app + CORS + router 掛载）
- [x] 2.5 建立 `backend/app/db.py`（async SQLAlchemy engine + session）
- [x] 2.6 初始化 Alembic（`alembic init migrations`）
- [x] 2.7 驗證 `uvicorn app.main:app --reload` 可啟動並存取 `/docs`

## 3. 資料庫 Models 與 Migrations
- [x] 3.1 建立 `backend/app/models/user.py`（User model）
- [x] 3.2 建立 `backend/app/models/collection.py`（Collection model，含 type/external_id/tags[]）
- [x] 3.3 建立首個 Alembic migration（建立 users, collections 表）
- [x] 3.4 驗證 `alembic upgrade head` 成功建立資料表

## 4. 使用者認證 API
- [x] 4.1 建立 `backend/app/schemas/user.py`（UserCreate, UserResponse, Token）
- [x] 4.2 建立 `backend/app/routers/auth.py`（POST /api/auth/register, POST /api/auth/login）
- [x] 4.3 實作 JWT 產生與驗證（`app/core/auth.py`）
- [x] 4.4 驗證：register → 取得 token → 帶 token 存取受保護路由

## 5. 收藏 CRUD API
- [x] 5.1 建立 `backend/app/schemas/collection.py`（CollectionCreate, CollectionUpdate, CollectionResponse）
- [x] 5.2 建立 `backend/app/routers/collections.py`：
  - GET /api/collections（需 JWT）
  - POST /api/collections（需 JWT）
  - PATCH /api/collections/{id}（需 JWT）
  - DELETE /api/collections/{id}（需 JWT）
- [x] 5.3 驗證 CRUD 全流程（建立、查詢、更新進度、刪除）

## 6. 外部搜尋 API
- [x] 6.1 建立 `backend/app/schemas/search.py`（SearchResult 統一 schema）
- [x] 6.2 建立 `backend/app/routers/search.py`（GET /api/search?q=&type=）
- [x] 6.3 實作 MyAnimeList 搜尋 adapter
- [x] 6.4 實作 TMDB 電影搜尋 adapter
- [x] 6.5 實作 Google Books 搜尋 adapter
- [x] 6.6 驗證三種類型搜尋都回傳統一格式

## 7. 前端整合
- [x] 7.1 在 `frontend/src/lib/api.ts` 建立 API client（封裝 fetch，自動帶 JWT header）
- [x] 7.2 新增 `frontend/src/lib/auth.ts`（JWT 存取/刷新邏輯，存於 localStorage）
- [x] 7.3 新增搜尋 UI 元件（SearchBar + SearchResultCard）
- [x] 7.4 在收藏新增流程中加入「從搜尋加入」按鈕
- [x] 7.5 將現有 LocalStorage hook 改為呼叫後端 API（可選：保留 offline fallback）
- [x] 7.6 新增簡易登入/註冊頁面

## 8. 驗證與文件
- [x] 8.1 在後端加入基本 pytest 測試（auth endpoints, search endpoints）
- [x] 8.2 更新根目錄 README.md（開發環境啟動步驟，環境變數說明）
- [x] 8.3 執行 `openspec validate add-backend-and-external-search --strict --no-interactive`
