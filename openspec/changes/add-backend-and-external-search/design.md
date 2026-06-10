# 設計文件：後端引入與 Monorepo 架構

## Monorepo 目錄結構

```
Pocketit/
├── frontend/               # 現有前端移入此目錄
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   └── tailwind.config.js
├── backend/                # 新建 Python FastAPI 後端
│   ├── app/
│   │   ├── main.py         # FastAPI app 入口
│   │   ├── db.py           # SQLAlchemy engine + session
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── collection.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── collection.py
│   │   │   └── search.py
│   │   └── routers/
│   │       ├── auth.py        # /api/auth/*
│   │       ├── collections.py # /api/collections/*
│   │       └── search.py      # /api/search
│   ├── migrations/            # Alembic 遷移
│   ├── requirements.txt
│   ├── .env.example
│   └── alembic.ini
├── openspec/
├── .agent/
├── package.json               # monorepo root（可選，用於統一 scripts）
└── README.md
```

## 後端技術選型

| 層 | 選擇 | 原因 |
|---|---|---|
| Web 框架 | FastAPI | 異步性能佳、自動產生 OpenAPI docs、型別安全 |
| ORM | SQLAlchemy 2.0 (async) | 成熟、支援 Alembic 遷移 |
| 資料庫 | PostgreSQL | 可靠、JSON 欄位支援 |
| 認證 | python-jose（JWT） | 輕量、標準 |
| HTTP 外部請求 | httpx (async) | 與 FastAPI 相容 |
| 遷移 | Alembic | 標準 SQLAlchemy 遷移工具 |

## 資料庫 Schema

```sql
-- users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- collections（統一用 type 區分漫畫/電影/書籍）
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,         -- 'manga' | 'movie' | 'book'
  external_id VARCHAR,           -- 第三方 ID（可選）
  title VARCHAR NOT NULL,
  author VARCHAR,
  thumbnail_url VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'want',
  total_chapters INTEGER,
  read_chapters INTEGER DEFAULT 0,
  rating DECIMAL(3,1),           -- 0-10，step 0.5
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 外部 API 統一 Schema

後端作為 Proxy，將各平台回傳格式統一為：

```json
{
  "externalId": "string",
  "type": "manga | movie | book",
  "title": "string",
  "originalTitle": "string | null",
  "thumbnail": "string | null",
  "description": "string | null",
  "author": "string | null",
  "year": "integer | null",
  "score": "float | null"
}
```

## 前端調整方向

- 加入 `frontend/src/lib/api.ts`，封裝後端 API 呼叫（fetch / React Query）
- 環境變數 `VITE_API_BASE_URL` 指向後端
- 現有 LocalStorage hook 逐步替換為 API hook（可暸望並行，先保留 fallback）

## CORS 策略

開發環境：後端允許 `http://localhost:5173`（Vite dev server）
正式環境：後端允許前端部署 domain

## 認證流程

```
POST /api/auth/register → 建立帳號 → 回傳 JWT
POST /api/auth/login    → 驗證密碼 → 回傳 JWT
Authorization: Bearer <token> → 所有 /api/collections/* 需帶上
```
