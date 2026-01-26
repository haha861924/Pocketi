# 測試指南

## 🧪 測試框架

Pocketit 使用以下測試工具:

- **Vitest**: 快速的單元測試框架,與 Vite 完美整合
- **React Testing Library**: React 元件測試工具
- **jsdom**: 模擬瀏覽器環境
- **@testing-library/jest-dom**: 提供額外的 DOM 斷言

## 🚀 執行測試

### 基本測試

```bash
# 執行所有測試
pnpm test

# 監視模式(自動重新執行測試)
pnpm test -- --watch

# 執行單一測試檔案
pnpm test src/App.test.tsx
```

### UI 模式

Vitest 提供互動式 UI 介面:

```bash
pnpm test:ui
```

這會開啟一個網頁介面,可以:

- 查看測試結果
- 過濾測試
- 查看測試覆蓋率
- 除錯測試

### 測試覆蓋率

```bash
pnpm test:coverage
```

## 📝 撰寫測試

### 測試檔案命名

- 測試檔案應與被測試的檔案同名,加上 `.test.tsx` 或 `.spec.tsx` 後綴
- 例如:`App.tsx` → `App.test.tsx`

### 測試結構

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('應該渲染正確的內容', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### 常用測試模式

#### 1. 渲染測試

```typescript
it('應該渲染元件', () => {
  render(<MyComponent />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

#### 2. 使用者互動測試

```typescript
import { userEvent } from '@testing-library/user-event'

it('應該處理點擊事件', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)

  const button = screen.getByRole('button')
  await user.click(button)

  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

#### 3. Props 測試

```typescript
it('應該接收並顯示 props', () => {
  render(<MyComponent title="Test Title" />)
  expect(screen.getByText('Test Title')).toBeInTheDocument()
})
```

#### 4. 條件渲染測試

```typescript
it('應該根據條件渲染不同內容', () => {
  const { rerender } = render(<MyComponent isVisible={false} />)
  expect(screen.queryByText('Content')).not.toBeInTheDocument()

  rerender(<MyComponent isVisible={true} />)
  expect(screen.getByText('Content')).toBeInTheDocument()
})
```

## 🎯 測試最佳實踐

### 1. 測試使用者行為,而非實作細節

✅ **好的做法**:

```typescript
expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
```

❌ **避免**:

```typescript
expect(wrapper.find(".submit-button")).toHaveLength(1);
```

### 2. 使用語意化查詢

優先順序:

1. `getByRole` - 最推薦
2. `getByLabelText` - 表單元素
3. `getByPlaceholderText` - 輸入框
4. `getByText` - 文字內容
5. `getByTestId` - 最後手段

### 3. 測試無障礙性

```typescript
it('應該有正確的 ARIA 屬性', () => {
  render(<MyButton />)
  const button = screen.getByRole('button')
  expect(button).toHaveAttribute('aria-label', 'Submit form')
})
```

### 4. 避免測試實作細節

❌ **避免測試內部狀態**:

```typescript
expect(component.state.count).toBe(1);
```

✅ **測試使用者可見的結果**:

```typescript
expect(screen.getByText("Count: 1")).toBeInTheDocument();
```

## 📊 測試覆蓋率目標

- **語句覆蓋率**: ≥ 80%
- **分支覆蓋率**: ≥ 75%
- **函數覆蓋率**: ≥ 80%
- **行覆蓋率**: ≥ 80%

## 🔍 除錯測試

### 查看渲染的 DOM

```typescript
import { screen } from '@testing-library/react'

it('除錯測試', () => {
  render(<MyComponent />)
  screen.debug() // 印出整個 DOM
  screen.debug(screen.getByRole('button')) // 印出特定元素
})
```

### 使用 logRoles

```typescript
import { logRoles } from '@testing-library/react'

it('查看所有 roles', () => {
  const { container } = render(<MyComponent />)
  logRoles(container)
})
```

## 📚 參考資源

- [Vitest 文件](https://vitest.dev/)
- [React Testing Library 文件](https://testing-library.com/react)
- [Testing Library 最佳實踐](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 現有測試

### App.test.tsx

測試 Landing Page 的主要功能:

- ✅ 渲染 Pocketit 標題
- ✅ 渲染導覽列
- ✅ 渲染 Hero Section
- ✅ 渲染六大核心功能
- ✅ 渲染使用流程
- ✅ 渲染頁尾聯絡資訊

執行測試:

```bash
pnpm test src/App.test.tsx
```
