# Change: 新增 Landing Page

## Why

Pocketit 是一個個人收藏管理平台,使用者可以記錄願望清單、看過的電影、買過的保養品化妝品、閱讀的書籍、觀看的電視劇和漫畫等各種生活記錄。目前專案僅有 Vite + React 的預設模板頁面,需要建立一個專業且吸引人的 Landing Page 來介紹產品功能和價值主張。

## What Changes

- 建立全新的 Landing Page 設計,包含以下區塊:
  - **Hero Section**: 主視覺區域,展示產品標語和主要 CTA
  - **Features Section**: 展示核心功能(願望清單、電影記錄、保養品記錄、書籍記錄等)
  - **How It Works**: 簡單的使用流程說明
  - **CTA Section**: 行動呼籲,引導使用者開始使用
- 採用現代化設計風格:
  - 使用漸層色彩和微動畫提升視覺體驗
  - 支援深色/淺色模式
  - 響應式設計,支援行動裝置
  - 使用 Google Fonts 提升字體質感
- 替換現有的 Vite 預設模板內容

## Impact

- Affected specs: `landing-page`(新增)
- Affected code:
  - `src/App.tsx` - 完全重寫為 Landing Page 元件
  - `src/index.css` - 更新全域樣式和設計系統
  - `src/App.css` - 更新為 Landing Page 專用樣式
  - 可能新增 `src/components/` - Landing Page 子元件
