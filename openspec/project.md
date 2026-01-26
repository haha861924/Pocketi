# Project Context

## Purpose

Pocketit 是一個基於 React 和 TypeScript 的現代化 Web 應用程式。本專案採用 Vite 作為建置工具,提供快速的開發體驗和熱模組替換(HMR)功能。

## Tech Stack

- **前端框架**: React 19.2.0
- **程式語言**: TypeScript 5.9.3
- **建置工具**: Vite 7.2.4
- **編譯器**: SWC (透過 @vitejs/plugin-react-swc)
- **程式碼檢查**: ESLint 9.39.1 with TypeScript ESLint
- **套件管理**: pnpm

## Project Conventions

### Code Style

- 使用 TypeScript 嚴格模式進行型別檢查
- 遵循 ESLint 推薦規則和 TypeScript ESLint 規範
- 使用 React Hooks 最佳實踐(eslint-plugin-react-hooks)
- 支援 React Fast Refresh(eslint-plugin-react-refresh)
- ECMAScript 版本: ES2020
- 使用 `.tsx` 副檔名處理 React 元件
- 使用 `.ts` 副檔名處理純 TypeScript 檔案

### Architecture Patterns

- **元件架構**: 採用 React 函數式元件和 Hooks
- **建置配置**: 使用 Vite 的 ESM 模式(`"type": "module"`)
- **TypeScript 專案參考**: 分離應用程式和 Node.js 配置
  - `tsconfig.app.json`: 應用程式程式碼配置
  - `tsconfig.node.json`: 建置工具配置
- **靜態資源**: 放置於 `public/` 目錄
- **原始碼**: 統一放置於 `src/` 目錄

### Testing Strategy

- 目前尚未配置測試框架
- 建議未來整合 Vitest 或 Jest 進行單元測試
- 建議整合 React Testing Library 進行元件測試

### Git Workflow

- 使用 OpenSpec 工作流程進行功能開發
- 建議使用語意化提交訊息(Conventional Commits)
- 建置產物(`dist/`)已加入 `.gitignore`

## Domain Context

這是一個全新的專案,目前處於初始化階段。專案名稱 "Pocketit" 暗示可能是一個口袋工具或內容收集應用,但具體業務邏輯尚待定義。

## Important Constraints

- **React Compiler**: 目前 React Compiler 與 SWC 不相容,若需使用 React Compiler 需切換至 Babel
- **瀏覽器相容性**: 目標環境為現代瀏覽器(支援 ES2020)
- **Node.js 版本**: 建議使用 Node.js 18+ 以確保 Vite 和相關工具正常運作

## External Dependencies

目前無外部服務依賴,所有依賴項均為開發工具和前端框架。未來可能整合:

- 後端 API 服務
- 資料庫或狀態管理解決方案
- 第三方 UI 元件庫
