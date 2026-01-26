# TailwindCSS 和 Style Guideline 設計文件

## Context

Pocketit 目前使用 Vanilla CSS 管理樣式,包含自定義的 CSS 變數系統。隨著專案成長,需要更系統化的樣式管理方案。TailwindCSS 提供 utility-first 的開發方式,配合完善的設計 tokens 系統,可以大幅提升開發效率和維護性。

專案目前的設計風格:

- 像素風格(Pixel Art)
- 柔和的莫蘭迪色系
- 圓角設計
- 深色/淺色模式支援

## Goals / Non-Goals

### Goals

- 導入 TailwindCSS 作為主要的樣式解決方案
- 建立系統化的 Style Guideline
- 保持現有的視覺設計風格(像素風格 + 莫蘭迪色系)
- 提升開發效率和程式碼可維護性
- 確保深色/淺色模式正常運作

### Non-Goals

- 不改變現有的視覺設計風格
- 不移除 Press Start 2P 像素字體
- 不引入其他 UI 框架(如 Material-UI)
- 不重新設計整個 Landing Page

## Decisions

### 技術決策

#### 1. 選擇 TailwindCSS

**決策**: 使用 TailwindCSS v3+ 作為主要樣式解決方案。

**理由**:

- **Utility-first**: 快速開發,減少命名困擾
- **設計 tokens**: 內建完善的設計系統
- **PurgeCSS**: 自動移除未使用的樣式,減小檔案大小
- **響應式**: 內建響應式工具類別
- **深色模式**: 原生支援深色模式
- **與 Vite 整合良好**: 官方支援,配置簡單

**替代方案**:

- Styled-components → 增加 runtime overhead
- CSS Modules → 缺乏設計系統
- 繼續使用 Vanilla CSS → 維護困難,缺乏系統化

#### 2. 配置策略

**決策**: 使用自定義 Tailwind 配置,將現有的設計 tokens 遷移到 `tailwind.config.js`。

**配置內容**:

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // 使用系統偏好
  theme: {
    extend: {
      colors: {
        pixel: {
          primary: "#D4A5A5",
          secondary: "#9C8AA5",
          accent: "#A5B9C4",
          highlight: "#E8D4A2",
          success: "#A5C4A5",
        },
        bg: {
          light: "#F5F1E8",
          dark: "#3A3A4A",
          "card-light": "#FEFDFB",
          "card-dark": "#4A4A5A",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        mono: ['"Space Mono"', "monospace"],
      },
      borderRadius: {
        "pixel-sm": "8px",
        "pixel-md": "12px",
        "pixel-lg": "16px",
        "pixel-xl": "24px",
      },
      boxShadow: {
        pixel: "4px 4px 0px rgba(0, 0, 0, 0.1)",
        "pixel-hover": "6px 6px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
```

#### 3. 遷移策略

**決策**: 漸進式遷移,保持視覺一致性。

**步驟**:

1. 安裝和配置 TailwindCSS
2. 遷移設計 tokens 到 Tailwind 配置
3. 逐步將元件改為使用 Tailwind classes
4. 保留必要的自定義 CSS(如動畫)
5. 驗證視覺效果無變化

**風險緩解**:

- 先在分支上進行,確認無問題後再合併
- 保留原始 CSS 檔案作為參考
- 使用視覺回歸測試(手動對比)

#### 4. Style Guideline 結構

**決策**: 建立 `docs/style-guideline.md` 文件,包含完整的設計系統文件。

**內容結構**:

```markdown
# Pocketit Style Guideline

## 色彩系統

- 主要色彩
- 背景色彩
- 文字色彩
- 使用規範

## 間距系統

- 基準網格(8px)
- 間距 tokens
- 使用範例

## 字體系統

- 字體家族
- 字體大小
- 行高和字重

## 元件樣式

- 按鈕
- 卡片
- 表單元素
- 導覽列

## 響應式設計

- 斷點定義
- 行動優先原則

## 最佳實踐

- 命名規範
- 常見模式
- 避免事項
```

### 架構決策

#### PostCSS 配置

**決策**: 使用 PostCSS 處理 TailwindCSS。

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### CSS 檔案結構

**決策**: 簡化 CSS 檔案結構。

```
src/
├── index.css          # Tailwind directives + 全域樣式
└── (移除 App.css)     # 改用 Tailwind utilities
```

**index.css 內容**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定義全域樣式 */
@layer base {
  body {
    @apply font-mono bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-pixel;
  }
}

/* 自定義元件樣式 */
@layer components {
  .pixel-button {
    @apply font-pixel text-sm px-8 py-4 bg-pixel-primary text-white
           border-3 border-text-light dark:border-text-dark rounded-pixel-md
           shadow-pixel hover:shadow-pixel-hover transition-all;
  }
}

/* 自定義動畫 */
@keyframes pixelFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Risks / Trade-offs

### 風險 1: 學習曲線

**風險**: 團隊成員可能不熟悉 TailwindCSS。

**緩解措施**:

- 提供完整的 Style Guideline 文件
- 建立範例元件供參考
- 在程式碼審查中分享最佳實踐

### 風險 2: HTML 類別名稱過長

**風險**: Tailwind utilities 可能導致 HTML 類別名稱很長。

**緩解措施**:

- 使用 `@apply` 提取常用組合
- 建立可重用的元件
- 使用編輯器的自動完成功能

### 風險 3: 建置時間增加

**風險**: TailwindCSS 可能增加建置時間。

**緩解措施**:

- 使用 JIT(Just-In-Time) 模式
- 正確配置 `content` 路徑
- 啟用快取機制

### Trade-off: 檔案大小 vs 開發體驗

**選擇**: 優先考慮開發體驗,使用完整的 Tailwind utilities。

**理由**:

- PurgeCSS 會在生產建置時移除未使用的樣式
- 開發階段的檔案大小不是主要考量
- 完整的 utilities 提供更好的開發體驗

## Migration Plan

### 步驟

1. **安裝依賴**:

   ```bash
   pnpm add -D tailwindcss postcss autoprefixer
   pnpm exec tailwindcss init -p
   ```

2. **配置 Tailwind**:
   - 建立 `tailwind.config.js`
   - 建立 `postcss.config.js`
   - 更新 `src/index.css`

3. **遷移設計 tokens**:
   - 將色彩變數遷移到 Tailwind 配置
   - 將間距、字體、圓角等遷移

4. **更新元件**:
   - 將 `App.tsx` 改為使用 Tailwind classes
   - 移除或簡化 `App.css`

5. **建立 Style Guideline**:
   - 撰寫 `docs/style-guideline.md`
   - 提供範例和最佳實踐

6. **測試驗證**:
   - 視覺回歸測試
   - 響應式測試
   - 深色模式測試
   - 生產建置測試

### Rollback

如果需要回滾:

- 使用 Git 恢復到變更前的 commit
- 移除 TailwindCSS 依賴:`pnpm remove tailwindcss postcss autoprefixer`
- 恢復原始的 CSS 檔案

## Open Questions

1. **是否需要 Tailwind UI 或其他 Tailwind 插件?**
   - 目前不需要,保持簡單
   - 未來可根據需求評估

2. **是否需要建立 Storybook 展示元件?**
   - 目前專案規模較小,暫不需要
   - Style Guideline 文件已足夠

3. **深色模式切換方式?**
   - 目前使用系統偏好(`media`)
   - 未來可考慮加入手動切換功能

4. **是否需要 Tailwind 的 Typography 插件?**
   - 目前不需要,內文排版較簡單
   - 未來如有部落格功能可考慮
