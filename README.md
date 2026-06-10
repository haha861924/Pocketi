# Pocketit

> 你的生活收藏管家 - 統一管理願望清單、電影、書籍、保養品、電視劇、漫畫等各種生活記錄

## 專案特色

- **像素風格設計**: 採用 8-bit 復古遊戲美學,搭配柔和的莫蘭迪色系
- **響應式設計**: 完美支援桌面、平板和行動裝置
- **深色模式**: 自動偵測系統偏好,提供舒適的視覺體驗
- **現代化技術棧**: React 19 + TypeScript + Vite + TailwindCSS
- **後端 API**: FastAPI + PostgreSQL，支援雲端資料同步
- **外部搜尋**: 串接 MyAnimeList、TMDB、Google Books

## 專案結構

```
Pocketit/
├── frontend/           # React + TypeScript 前端
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/            # FastAPI + Python 後端
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── core/
│   ├── migrations/
│   ├── tests/
│   └── requirements.txt
├── openspec/           # 規格文件
└── docs/               # 設計文件
```

## 快速開始

### 環境需求

- **Node.js**: 20.19+ 或 22.12+
- **pnpm**: 推薦使用 pnpm 作為套件管理工具
- **Python**: 3.9+
- **PostgreSQL**: 14+（後端需要）

### 前端

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:5173
```

### 後端

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 複製環境變數
cp .env.example .env
# 編輯 .env 填入 DATABASE_URL、SECRET_KEY、API Keys

# 資料庫遷移
alembic upgrade head

# 啟動
uvicorn app.main:app --reload   # http://localhost:8000
```

### 環境變數

| 變數 | 說明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 連接字串 |
| `SECRET_KEY` | JWT 簽名密鑰 |
| `MAL_CLIENT_ID` | MyAnimeList API Client ID |
| `TMDB_API_KEY` | TMDB API Key |
| `GOOGLE_BOOKS_API_KEY` | Google Books API Key |
| `VITE_API_BASE_URL` | 前端 API 基礎 URL（預設 http://localhost:8000） |

## API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/auth/register` | 註冊新帳號 |
| POST | `/api/auth/login` | 登入取得 JWT |
| GET | `/api/collections` | 取得收藏清單 |
| POST | `/api/collections` | 新增收藏 |
| PATCH | `/api/collections/{id}` | 更新收藏 |
| DELETE | `/api/collections/{id}` | 刪除收藏 |
| GET | `/api/search?q=&type=` | 外部搜尋（manga/movie/book） |

## 測試

```bash
# 前端測試
cd frontend && pnpm test

# 後端測試
cd backend && source venv/bin/activate && python -m pytest tests/ -v
```

## 開發規範

- 使用 ESLint 進行程式碼檢查
- 遵循 React Hooks 最佳實踐
- 使用 TypeScript 嚴格模式
- 提交格式: `type(scope): description`

## 授權

Copyright 2026 Pocketit. All rights reserved.
