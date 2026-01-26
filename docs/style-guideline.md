# Pocketit Style Guideline

## 🎨 設計系統概述

Pocketit 採用**像素風格(Pixel Art)**搭配**柔和的莫蘭迪色系**,使用 TailwindCSS 作為樣式解決方案。本指南定義了完整的設計系統,確保 UI 的一致性和可維護性。

---

## 色彩系統

### 主要色彩

| 色彩名稱  | Tailwind Class                                | 色碼      | 用途                     |
| --------- | --------------------------------------------- | --------- | ------------------------ |
| Primary   | `bg-pixel-primary` / `text-pixel-primary`     | `#D4A5A5` | 主要按鈕、強調元素、Logo |
| Secondary | `bg-pixel-secondary` / `text-pixel-secondary` | `#9C8AA5` | 次要按鈕、標題、圖示     |
| Accent    | `bg-pixel-accent` / `text-pixel-accent`       | `#A5B9C4` | 強調色、Hover 狀態       |
| Highlight | `bg-pixel-highlight` / `text-pixel-highlight` | `#E8D4A2` | 提示訊息、亮點標記       |
| Success   | `bg-pixel-success` / `text-pixel-success`     | `#A5C4A5` | 成功狀態、確認訊息       |

### 背景色彩

| 色彩名稱         | Tailwind Class     | 色碼      | 用途             |
| ---------------- | ------------------ | --------- | ---------------- |
| Light Background | `bg-bg-light`      | `#F5F1E8` | 淺色模式主背景   |
| Dark Background  | `bg-bg-dark`       | `#3A3A4A` | 深色模式主背景   |
| Card Light       | `bg-bg-card-light` | `#FEFDFB` | 淺色模式卡片背景 |
| Card Dark        | `bg-bg-card-dark`  | `#4A4A5A` | 深色模式卡片背景 |

### 文字色彩

| 色彩名稱    | Tailwind Class          | 色碼      | 用途             |
| ----------- | ----------------------- | --------- | ---------------- |
| Text Light  | `text-text-light`       | `#4A4A5A` | 淺色模式主要文字 |
| Text Dark   | `text-text-dark`        | `#E8E4D8` | 深色模式主要文字 |
| Muted Light | `text-text-muted-light` | `#8A8A9A` | 淺色模式次要文字 |
| Muted Dark  | `text-text-muted-dark`  | `#B8B4A8` | 深色模式次要文字 |

### 使用範例

```jsx
// 主要按鈕
<button className="bg-pixel-primary text-white">按鈕</button>

// 卡片背景(支援深色模式)
<div className="bg-bg-card-light dark:bg-bg-card-dark">內容</div>

// 文字色彩(支援深色模式)
<p className="text-text-light dark:text-text-dark">文字</p>
```

---

## 間距系統

基於 **8px 網格系統**,確保一致的間距和對齊。

| 名稱 | Tailwind Class                | 數值 | 用途     |
| ---- | ----------------------------- | ---- | -------- |
| XS   | `p-xs` / `m-xs` / `gap-xs`    | 8px  | 極小間距 |
| SM   | `p-sm` / `m-sm` / `gap-sm`    | 16px | 小間距   |
| MD   | `p-md` / `m-md` / `gap-md`    | 24px | 中間距   |
| LG   | `p-lg` / `m-lg` / `gap-lg`    | 32px | 大間距   |
| XL   | `p-xl` / `m-xl` / `gap-xl`    | 48px | 超大間距 |
| 2XL  | `p-2xl` / `m-2xl` / `gap-2xl` | 64px | 區塊間距 |

### 使用原則

- **元件內部**: 使用 `sm` 或 `md`
- **元件之間**: 使用 `lg` 或 `xl`
- **區塊之間**: 使用 `2xl`

### 使用範例

```jsx
// 按鈕內邊距
<button className="px-lg py-sm">按鈕</button>

// 卡片內邊距
<div className="p-lg">卡片內容</div>

// 區塊間距
<section className="py-2xl">區塊內容</section>
```

---

## 字體系統

### 字體家族

| 字體名稱   | Tailwind Class | 字體           | 用途                 |
| ---------- | -------------- | -------------- | -------------------- |
| Pixel Font | `font-pixel`   | Press Start 2P | 標題、按鈕、強調文字 |
| Mono Font  | `font-mono`    | Space Mono     | 內文、描述文字       |

### 字體大小

使用 Tailwind 預設的字體大小系統:

| Class       | 大小     | 用途         |
| ----------- | -------- | ------------ |
| `text-xs`   | 0.75rem  | 小標籤、註解 |
| `text-sm`   | 0.875rem | 次要文字     |
| `text-base` | 1rem     | 內文         |
| `text-lg`   | 1.25rem  | 小標題       |
| `text-xl`   | 1.5rem   | 中標題       |
| `text-2xl`  | 2rem     | 大標題       |
| `text-3xl`  | 2.5rem   | 超大標題     |
| `text-4xl`  | 3rem     | Hero 標題    |

### 使用範例

```jsx
// 標題(使用像素字體)
<h1 className="font-pixel text-4xl text-pixel-primary">POCKETIT</h1>

// 內文(使用等寬字體)
<p className="font-mono text-base text-text-light">描述文字</p>
```

---

## 圓角系統

所有 UI 元素使用圓角設計,避免直角。

| 名稱   | Tailwind Class     | 數值 | 用途             |
| ------ | ------------------ | ---- | ---------------- |
| Small  | `rounded-pixel-sm` | 8px  | 小元素、導覽連結 |
| Medium | `rounded-pixel-md` | 12px | 按鈕、圖片、Logo |
| Large  | `rounded-pixel-lg` | 16px | 卡片、容器       |
| XLarge | `rounded-pixel-xl` | 24px | 大型容器         |

### 使用範例

```jsx
// 按鈕
<button className="rounded-pixel-md">按鈕</button>

// 卡片
<div className="rounded-pixel-lg">卡片</div>

// 圓形元素
<div className="rounded-full">圓形</div>
```

---

## 陰影系統

像素風格的陰影效果,使用偏移陰影而非模糊陰影。

| 名稱         | Tailwind Class       | 效果                         | 用途       |
| ------------ | -------------------- | ---------------------------- | ---------- |
| Pixel Shadow | `shadow-pixel`       | 4px 4px 0px rgba(0,0,0,0.1)  | 一般狀態   |
| Pixel Hover  | `shadow-pixel-hover` | 6px 6px 0px rgba(0,0,0,0.15) | Hover 狀態 |

### 使用範例

```jsx
// 卡片陰影
<div className="shadow-pixel hover:shadow-pixel-hover">卡片</div>
```

---

## 元件樣式規範

### 按鈕

#### 基本按鈕

```jsx
<button className="pixel-button">按鈕文字</button>
```

#### 大型按鈕

```jsx
<button className="pixel-button pixel-button-large">大型按鈕</button>
```

#### 按鈕變體

```jsx
// 次要按鈕
<button className="pixel-button pixel-button-secondary">次要</button>

// 強調按鈕
<button className="pixel-button pixel-button-accent">強調</button>
```

### 卡片

```jsx
<div className="pixel-card">
  <h3 className="text-lg mb-sm text-pixel-secondary">卡片標題</h3>
  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">卡片內容</p>
</div>
```

### 導覽連結

```jsx
<a
  href="#section"
  className="font-pixel text-xs text-text-light dark:text-text-dark px-sm py-xs border-2 border-transparent rounded-pixel-sm transition-all hover:border-pixel-primary hover:text-pixel-primary hover:bg-pixel-primary/10"
>
  連結
</a>
```

---

## 響應式設計

### 斷點

使用 Tailwind 預設斷點:

| 斷點   | 最小寬度 | 用途     |
| ------ | -------- | -------- |
| `sm:`  | 640px    | 小型平板 |
| `md:`  | 768px    | 平板     |
| `lg:`  | 1024px   | 桌面     |
| `xl:`  | 1280px   | 大桌面   |
| `2xl:` | 1536px   | 超大桌面 |

### 行動優先原則

預設樣式適用於行動裝置,使用斷點前綴處理較大螢幕:

```jsx
// 行動裝置單欄,平板 2 欄,桌面 3 欄
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  {/* 內容 */}
</div>

// 行動裝置小字,桌面大字
<h1 className="text-2xl md:text-4xl">標題</h1>
```

---

## 深色模式

使用 `dark:` 前綴處理深色模式樣式:

```jsx
// 背景色
<div className="bg-bg-light dark:bg-bg-dark">

// 文字色
<p className="text-text-light dark:text-text-dark">

// 邊框色
<div className="border-text-light dark:border-text-dark">
```

---

## 最佳實踐

### 1. 優先使用 Utility Classes

✅ **推薦**:

```jsx
<button className="px-lg py-sm bg-pixel-primary text-white rounded-pixel-md">按鈕</button>
```

❌ **避免**:

```jsx
<button className="custom-button">按鈕</button>
```

### 2. 使用 @apply 提取重複樣式

當相同的 utility 組合重複出現時,使用 `@apply` 建立元件類別:

```css
@layer components {
  .pixel-button {
    @apply font-pixel text-sm px-lg py-sm bg-pixel-primary text-white
           border-3 border-text-light dark:border-text-dark rounded-pixel-md
           shadow-pixel hover:shadow-pixel-hover transition-all;
  }
}
```

### 3. 保持類別名稱順序

建議順序:

1. 佈局(flex, grid, position)
2. 尺寸(w-, h-, max-w-)
3. 間距(p-, m-, gap-)
4. 字體(font-, text-)
5. 色彩(bg-, text-, border-)
6. 邊框和圓角(border-, rounded-)
7. 陰影和效果(shadow-)
8. 互動(hover:, focus:, active:)
9. 動畫(transition-, animation-)

### 4. 深色模式一致性

確保所有色彩相關的 class 都有對應的 `dark:` 變體:

```jsx
<div className="bg-bg-card-light dark:bg-bg-card-dark text-text-light dark:text-text-dark">
```

### 5. 使用語意化的間距

```jsx
// ✅ 使用命名間距
<div className="p-lg gap-md">

// ❌ 避免任意數值
<div className="p-[32px] gap-[24px]">
```

---

## 常見模式

### 容器

```jsx
<div className="container">{/* 最大寬度 1280px,自動置中,左右 padding */}</div>
```

### 區塊

```jsx
<section className="py-2xl">{/* 上下 64px padding */}</section>
```

### 卡片網格

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  <div className="pixel-card">卡片 1</div>
  <div className="pixel-card">卡片 2</div>
  <div className="pixel-card">卡片 3</div>
</div>
```

### 淡入動畫

```jsx
<div className="fade-in">{/* 自動淡入動畫 */}</div>
```

---

## 避免事項

❌ **不要使用內聯樣式**

```jsx
// 避免
<div style={{color: '#D4A5A5'}}>
```

❌ **不要使用任意數值(除非必要)**

```jsx
// 避免
<div className="p-[17px]">

// 使用
<div className="p-sm">
```

❌ **不要忘記深色模式**

```jsx
// 避免
<div className="bg-white text-black">

// 使用
<div className="bg-bg-card-light dark:bg-bg-card-dark text-text-light dark:text-text-dark">
```

---

## 總結

Pocketit 的設計系統強調:

- **一致性**: 使用統一的設計 tokens
- **可維護性**: 系統化的樣式管理
- **響應式**: 行動優先的設計原則
- **無障礙**: 足夠的色彩對比度
- **效能**: TailwindCSS 的 PurgeCSS 優化

遵循本指南,確保整個專案的 UI 保持一致且高品質!
