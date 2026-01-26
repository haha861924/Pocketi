# Pocketit

> 你的生活收藏管家 - 統一管理願望清單、電影、書籍、保養品、電視劇、漫畫等各種生活記錄

## 🎨 專案特色

- **像素風格設計**: 採用 8-bit 復古遊戲美學,搭配柔和的莫蘭迪色系
- **響應式設計**: 完美支援桌面、平板和行動裝置
- **深色模式**: 自動偵測系統偏好,提供舒適的視覺體驗
- **現代化技術棧**: React 19 + TypeScript + Vite + TailwindCSS

## 🚀 快速開始

### 環境需求

- **Node.js**: 20.19+ 或 22.12+
- **pnpm**: 推薦使用 pnpm 作為套件管理工具

### 安裝

```bash
# 克隆專案
git clone <repository-url>
cd Pocketit

# 安裝依賴
pnpm install
```

### 開發

```bash
# 啟動開發伺服器
pnpm dev

# 應用將在 http://localhost:5173 運行
```

### 建置

```bash
# 建置生產版本
pnpm build

# 預覽生產版本
pnpm preview
```

## 📁 專案結構

```
Pocketit/
├── public/                 # 靜態資源
│   ├── pixel_logo_*.png   # Logo 和圖示
│   └── pixel_icon_*.png   # 功能圖示
├── src/
│   ├── App.tsx            # 主應用元件
│   ├── index.css          # 全域樣式和 Tailwind 配置
│   └── main.tsx           # 應用入口
├── docs/
│   └── style-guideline.md # 設計系統文件
├── openspec/              # OpenSpec 規格文件
│   ├── changes/           # 變更提案
│   └── project.md         # 專案概述
├── tailwind.config.js     # Tailwind 配置
├── vite.config.ts         # Vite 配置
└── package.json
```

## 🎨 設計系統

Pocketit 使用完整的設計系統,確保 UI 的一致性和可維護性。

### 色彩系統

- **主色**: `#D4A5A5` (柔和玫瑰粉)
- **輔色**: `#9C8AA5` (柔和紫灰)
- **強調色**: `#A5B9C4` (柔和藍灰)

### 字體

- **標題**: Press Start 2P (像素字體)
- **內文**: Space Mono (等寬字體)

### 圓角

- Small: `8px`
- Medium: `12px`
- Large: `16px`
- XLarge: `24px`

詳細的設計規範請參考 [Style Guideline](./docs/style-guideline.md)。

## 🛠️ 技術棧

- **框架**: [React 19](https://react.dev/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **建置工具**: [Vite](https://vitejs.dev/)
- **樣式**: [TailwindCSS 3](https://tailwindcss.com/)
- **字體**: [Google Fonts](https://fonts.google.com/)

## 📝 開發規範

### 程式碼風格

- 使用 ESLint 進行程式碼檢查
- 遵循 React Hooks 最佳實踐
- 使用 TypeScript 嚴格模式

### 樣式規範

- 優先使用 TailwindCSS utility classes
- 使用 `@layer components` 定義可重用元件樣式
- 確保所有色彩都支援深色模式(`dark:` 前綴)

### 提交規範

建議使用語意化的提交訊息:

```
feat: 新增功能
fix: 修復問題
docs: 文件更新
style: 樣式調整
refactor: 程式碼重構
test: 測試相關
chore: 建置或工具相關
```

## 🎯 核心功能

### 已實作

- ✅ Landing Page
  - Hero Section
  - 功能展示(6 大核心功能)
  - 使用流程說明
  - CTA 區塊
  - 頁尾(含聯絡資訊)

### 規劃中

- 📋 願望清單管理
- 🎬 電影記錄
- 💄 保養品 & 化妝品記錄
- 📚 書籍閱讀記錄
- 📺 電視劇追蹤
- 📖 漫畫收藏

## 📖 文件

- [Style Guideline](./docs/style-guideline.md) - 完整的設計系統文件
- [OpenSpec Changes](./openspec/changes/) - 變更提案和規格
- [Project Overview](./openspec/project.md) - 專案概述

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request!

## 📧 聯絡

如有任何問題或建議,請聯絡:

- Email: elvina861924@gmail.com

## 📄 授權

Copyright © 2026 Pocketit. All rights reserved.

---

Made with ❤️ and pixels
