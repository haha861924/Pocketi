## ADDED Requirements

### Requirement: Monorepo 目錄慣例

專案 MUST 採用 monorepo 結構，以 `frontend/` 和 `backend/` 作為頂層子目錄，分別管理前後端程式碼。

#### Scenario: 前端開發啟動

- **WHEN** 開發者在 `frontend/` 目錄執行 `pnpm dev`
- **THEN** Vite dev server 在 `http://localhost:5173` 啟動
- **AND** 熱模組替換正常運作

#### Scenario: 後端開發啟動

- **WHEN** 開發者在 `backend/` 目錄執行 `uvicorn app.main:app --reload`
- **THEN** FastAPI server 在 `http://localhost:8000` 啟動
- **AND** OpenAPI 文件可透過 `http://localhost:8000/docs` 存取

#### Scenario: 環境變數管理

- **WHEN** 開發者複製 `backend/.env.example` 為 `backend/.env`
- **THEN** 填入 DATABASE_URL、SECRET_KEY、MAL_CLIENT_ID、TMDB_API_KEY、GOOGLE_BOOKS_API_KEY
- **AND** 前端使用 `frontend/.env.local` 設定 `VITE_API_BASE_URL`
