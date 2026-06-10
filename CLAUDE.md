# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Pocketit is a personal life collection manager (你的生活收藏管家) built with a pixel-art aesthetic and Morandi color palette. It lets users track manga, wishlists, movies, cosmetics, books, and TV shows. Data can be stored client-side (IndexedDB) or synced via the backend API (PostgreSQL).

## Monorepo Structure

- `frontend/` — React 19 + TypeScript + Vite + TailwindCSS
- `backend/` — FastAPI + SQLAlchemy (async) + PostgreSQL

## Commands

### Frontend

```bash
cd frontend
pnpm install
pnpm dev              # Dev server at http://localhost:5173
pnpm build            # Type-check (tsc -b) then Vite build
pnpm lint             # ESLint
pnpm test             # Vitest in watch mode
pnpm vitest run src/features/manga/useMangaStore.test.ts  # Single test
```

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload   # http://localhost:8000, docs at /docs
alembic upgrade head            # Run migrations
python -m pytest tests/ -v      # Run tests
```

## Architecture

### Frontend
- **Routing**: React Router v7 in `src/App.tsx` — `/` (landing), `/login`, `/manga`, catch-all redirects to `/`
- **Feature modules**: `src/features/<feature>/` — types, components, hooks per feature
- **State**: `useMangaStore` hook — dual mode: API (when logged in) or IndexedDB (offline). Includes localStorage-to-IndexedDB migration
- **API layer**: `src/lib/api.ts` (fetch wrapper with JWT), `src/lib/auth.ts` (login/register/logout)
- **Search**: `src/features/search/SearchPanel.tsx` — external search via backend API
- **Shared UI**: `src/components/ui/` — `StarRating`, `TagInput`

### Backend
- **FastAPI app**: `app/main.py` with CORS for localhost:5173
- **Auth**: JWT via `python-jose`, bcrypt passwords. `app/core/auth.py`, `app/routers/auth.py`
- **Collections CRUD**: `app/routers/collections.py` — supports type/status/keyword filtering, auto-complete status
- **External search**: `app/routers/search.py` — proxies MyAnimeList, TMDB, Google Books with 60s in-memory cache
- **Models**: `app/models/user.py`, `app/models/collection.py` (SQLAlchemy 2.0 mapped columns)
- **Migrations**: Alembic in `migrations/`

## Design System

Pixel-art style with Morandi palette. Fonts: "Press Start 2P" (headings), "Space Mono" (body). All colors must support dark mode. Use TailwindCSS utility classes. Full spec in `docs/style-guideline.md`.

## OpenSpec (Spec-Driven Development)

Read `openspec/AGENTS.md` when handling planning, proposals, specs, new capabilities, or architecture changes.

```bash
openspec list                                        # Active changes
openspec spec list --long                            # Existing specs
openspec validate <change-id> --strict --no-interactive  # Validate
```

## Code Conventions

- Components: PascalCase; functions/variables: camelCase; constants: UPPER_SNAKE_CASE; files: kebab-case
- Functional components + React Hooks only
- Backend: Python 3.9+ compatible (`from __future__ import annotations` for type hints)
- Commit format: `type(scope): description`
- Language in UI and comments: Traditional Chinese (繁體中文)

## Git Workflow

- Feature branches: `feature/[name]`, fix branches: `fix/[description]`
- Package manager: **pnpm** (frontend), **pip** (backend)

## Environment Variables

Backend: `backend/.env` (copy from `.env.example`) — DATABASE_URL, SECRET_KEY, MAL_CLIENT_ID, TMDB_API_KEY, GOOGLE_BOOKS_API_KEY
Frontend: `frontend/.env.local` — VITE_API_BASE_URL (default http://localhost:8000)
