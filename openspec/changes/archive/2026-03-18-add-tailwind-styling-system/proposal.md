# Change: 導入 TailwindCSS 和建立 Style Guideline

## Why

目前專案使用 Vanilla CSS 管理樣式,隨著專案規模增長,會面臨以下問題:

1. **樣式管理困難**:CSS 變數和類別散落在不同檔案,難以維護
2. **缺乏系統化**:配色、間距、字體等設計 tokens 缺乏統一管理
3. **開發效率低**:每次新增元件都需要手寫大量 CSS
4. **一致性問題**:沒有明確的 Style Guideline,容易產生不一致的設計

導入 TailwindCSS 和建立 Style Guideline 可以:

- 提供 utility-first 的開發方式,加速開發
- 系統化管理設計 tokens(色彩、間距、字體等)
- 確保 UI 一致性和可維護性
- 減少 CSS 檔案大小(透過 PurgeCSS)

## What Changes

- **導入 TailwindCSS**:
  - 安裝 TailwindCSS 及相關依賴
  - 配置 `tailwind.config.js`
  - 整合到 Vite 建置流程
  - 將現有的 CSS 變數遷移到 Tailwind 配置

- **建立 Style Guideline**:
  - 定義完整的設計系統(Design System)
  - 系統化配色方案(莫蘭迪色系)
  - 標準化間距、字體、圓角等設計 tokens
  - 建立元件樣式規範
  - 文件化 Style Guideline 供團隊參考

- **遷移現有樣式**:
  - 將 `index.css` 中的設計 tokens 遷移到 Tailwind 配置
  - 將 `App.css` 中的元件樣式改為 Tailwind utilities
  - 保持現有的像素風格和莫蘭迪配色

## Impact

- Affected specs: `styling-system`(新增)
- Affected code:
  - `package.json` - 新增 TailwindCSS 依賴
  - `tailwind.config.js` - 新增配置檔案
  - `postcss.config.js` - 新增 PostCSS 配置
  - `src/index.css` - 簡化為 Tailwind directives
  - `src/App.css` - 可能移除或大幅簡化
  - `src/App.tsx` - 使用 Tailwind classes
  - `docs/style-guideline.md` - 新增 Style Guideline 文件
- **BREAKING**: 現有的 CSS 類別名稱會改變,但視覺效果保持一致
