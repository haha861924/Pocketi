# 漫畫收藏功能測試規格

## 📋 測試概述

本文件定義漫畫收藏功能的完整測試規格,包含單元測試、整合測試和端對端測試的測試案例。所有測試使用 Vitest 和 React Testing Library 撰寫。

## 🎯 測試目標

- **測試覆蓋率**: ≥ 80% (語句、分支、函數、行)
- **測試原則**: 測試使用者行為,而非實作細節
- **測試策略**: 由下而上(單元測試 → 整合測試 → 端對端測試)

## 🧪 測試檔案結構

```
src/features/manga/
├── types.ts
├── useMangaStore.ts
├── useMangaStore.test.ts          # 狀態管理測試
├── MangaList.tsx
├── MangaList.test.tsx              # 清單元件測試
├── MangaCard.tsx
├── MangaCard.test.tsx              # 卡片元件測試
├── MangaForm.tsx
├── MangaForm.test.tsx              # 表單元件測試
├── MangaDetail.tsx
└── MangaDetail.test.tsx            # 詳情元件測試
```

---

## 1️⃣ 單元測試: useMangaStore.test.ts

### 測試範圍

測試狀態管理 Hook 的所有 CRUD 操作和資料處理邏輯。

### 測試案例

#### 1.1 初始化測試

```typescript
describe("useMangaStore - 初始化", () => {
  it("應該從 LocalStorage 載入現有資料", () => {
    // Given: LocalStorage 中有漫畫資料
    // When: Hook 初始化
    // Then: 應載入所有漫畫資料
  });

  it("應該在 LocalStorage 無資料時返回空陣列", () => {
    // Given: LocalStorage 中無資料
    // When: Hook 初始化
    // Then: mangas 應為空陣列
  });

  it("應該處理 LocalStorage 中的無效 JSON 資料", () => {
    // Given: LocalStorage 中有無效的 JSON
    // When: Hook 初始化
    // Then: 應返回空陣列並記錄錯誤
  });
});
```

#### 1.2 新增漫畫測試

```typescript
describe("useMangaStore - 新增漫畫", () => {
  it("應該成功新增漫畫項目", () => {
    // Given: 有效的漫畫資料
    // When: 呼叫 addManga()
    // Then: 漫畫應新增至清單
    // And: 應自動產生 UUID
    // And: 應設定 createdAt 和 updatedAt
    // And: 應儲存至 LocalStorage
  });

  it("應該在新增時設定預設值", () => {
    // Given: 僅提供必填欄位的漫畫資料
    // When: 呼叫 addManga()
    // Then: readChapters 應預設為 0
    // And: tags 應預設為空陣列
    // And: status 應預設為 'want-to-read'
  });

  it("應該拒絕無效的漫畫資料", () => {
    // Given: 缺少必填欄位的資料
    // When: 呼叫 addManga()
    // Then: 應拋出錯誤或返回失敗
  });
});
```

#### 1.3 更新漫畫測試

```typescript
describe("useMangaStore - 更新漫畫", () => {
  it("應該成功更新漫畫資訊", () => {
    // Given: 現有的漫畫項目
    // When: 呼叫 updateManga() 更新資料
    // Then: 漫畫資訊應更新
    // And: updatedAt 應更新為當前時間
    // And: 應儲存至 LocalStorage
  });

  it("應該在進度達到 100% 時自動更新狀態為已完成", () => {
    // Given: 漫畫的 totalChapters 為 100
    // When: 更新 readChapters 為 100
    // Then: status 應自動更新為 'completed'
  });

  it("應該處理不存在的漫畫 ID", () => {
    // Given: 不存在的漫畫 ID
    // When: 呼叫 updateManga()
    // Then: 應返回錯誤或不執行任何操作
  });
});
```

#### 1.4 刪除漫畫測試

```typescript
describe("useMangaStore - 刪除漫畫", () => {
  it("應該成功刪除漫畫項目", () => {
    // Given: 現有的漫畫項目
    // When: 呼叫 deleteManga()
    // Then: 漫畫應從清單中移除
    // And: 應更新 LocalStorage
  });

  it("應該處理不存在的漫畫 ID", () => {
    // Given: 不存在的漫畫 ID
    // When: 呼叫 deleteManga()
    // Then: 應不影響現有清單
  });
});
```

#### 1.5 搜尋與篩選測試

```typescript
describe("useMangaStore - 搜尋", () => {
  it("應該依漫畫名稱搜尋", () => {
    // Given: 清單中有多本漫畫
    // When: 搜尋關鍵字 "ONE PIECE"
    // Then: 應返回名稱包含關鍵字的漫畫
  });

  it("應該依作者名稱搜尋", () => {
    // Given: 清單中有多本漫畫
    // When: 搜尋作者 "尾田榮一郎"
    // Then: 應返回該作者的所有漫畫
  });

  it("應該不區分大小寫搜尋", () => {
    // Given: 漫畫名稱為 "ONE PIECE"
    // When: 搜尋 "one piece"
    // Then: 應找到該漫畫
  });

  it("應該在無符合結果時返回空陣列", () => {
    // Given: 清單中無符合的漫畫
    // When: 搜尋不存在的關鍵字
    // Then: 應返回空陣列
  });
});

describe("useMangaStore - 篩選", () => {
  it("應該依狀態篩選漫畫", () => {
    // Given: 清單中有不同狀態的漫畫
    // When: 篩選 status = 'reading'
    // Then: 應僅返回閱讀中的漫畫
  });

  it("應該依評分範圍篩選", () => {
    // Given: 清單中有不同評分的漫畫
    // When: 篩選評分 >= 8
    // Then: 應返回評分 8 分以上的漫畫
  });

  it("應該依標籤篩選", () => {
    // Given: 清單中有不同標籤的漫畫
    // When: 篩選標籤包含 "冒險"
    // Then: 應返回有該標籤的漫畫
  });

  it("應該支援多條件組合篩選", () => {
    // Given: 清單中有多本漫畫
    // When: 同時篩選 status = 'reading' 且 rating >= 8
    // Then: 應返回同時符合兩個條件的漫畫
  });
});
```

#### 1.6 排序測試

```typescript
describe("useMangaStore - 排序", () => {
  it("應該依新增時間排序(最新優先)", () => {
    // Given: 清單中有多本漫畫
    // When: 排序方式為 'createdAt-desc'
    // Then: 應依 createdAt 降序排列
  });

  it("應該依漫畫名稱排序(A-Z)", () => {
    // Given: 清單中有多本漫畫
    // When: 排序方式為 'title-asc'
    // Then: 應依標題字母順序排列
  });

  it("應該依評分排序(高至低)", () => {
    // Given: 清單中有多本漫畫
    // When: 排序方式為 'rating-desc'
    // Then: 應依評分降序排列
    // And: 無評分的漫畫應排在最後
  });

  it("應該依更新時間排序(最近更新)", () => {
    // Given: 清單中有多本漫畫
    // When: 排序方式為 'updatedAt-desc'
    // Then: 應依 updatedAt 降序排列
  });
});
```

#### 1.7 LocalStorage 持久化測試

```typescript
describe("useMangaStore - LocalStorage", () => {
  it("應該在新增漫畫時儲存至 LocalStorage", () => {
    // Given: 新增一本漫畫
    // When: addManga() 執行完成
    // Then: LocalStorage 應包含該漫畫資料
  });

  it("應該在更新漫畫時同步至 LocalStorage", () => {
    // Given: 更新現有漫畫
    // When: updateManga() 執行完成
    // Then: LocalStorage 應反映最新資料
  });

  it("應該在刪除漫畫時從 LocalStorage 移除", () => {
    // Given: 刪除一本漫畫
    // When: deleteManga() 執行完成
    // Then: LocalStorage 不應包含該漫畫
  });

  it("應該儲存資料版本號", () => {
    // Given: 任何資料變更
    // When: 儲存至 LocalStorage
    // Then: 應包含 version 欄位
  });
});
```

---

## 2️⃣ 元件測試: MangaList.test.tsx

### 測試範圍

測試漫畫清單元件的渲染和使用者互動。

### 測試案例

#### 2.1 渲染測試

```typescript
describe("MangaList - 渲染", () => {
  it("應該渲染漫畫清單標題", () => {
    // Given: 元件掛載
    // When: 渲染完成
    // Then: 應顯示 "漫畫收藏" 標題
  });

  it("應該渲染所有漫畫卡片", () => {
    // Given: 有 5 本漫畫
    // When: 元件渲染
    // Then: 應顯示 5 張漫畫卡片
  });

  it("應該在無漫畫時顯示空狀態", () => {
    // Given: 漫畫清單為空
    // When: 元件渲染
    // Then: 應顯示空狀態提示訊息
    // And: 應顯示「新增漫畫」按鈕
  });

  it("應該渲染新增漫畫按鈕", () => {
    // Given: 元件掛載
    // When: 渲染完成
    // Then: 應顯示「新增漫畫」按鈕
  });
});
```

#### 2.2 搜尋功能測試

```typescript
describe("MangaList - 搜尋", () => {
  it("應該顯示搜尋框", () => {
    // Given: 元件渲染
    // When: 查看頁面
    // Then: 應顯示搜尋輸入框
  });

  it("應該在輸入關鍵字時即時篩選清單", async () => {
    // Given: 清單中有 "ONE PIECE" 和 "火影忍者"
    // When: 在搜尋框輸入 "ONE"
    // Then: 應僅顯示 "ONE PIECE"
  });

  it("應該顯示搜尋結果數量", async () => {
    // Given: 搜尋後有 3 個結果
    // When: 查看頁面
    // Then: 應顯示 "找到 3 個結果"
  });
});
```

#### 2.3 篩選功能測試

```typescript
describe("MangaList - 篩選", () => {
  it("應該顯示狀態篩選器", () => {
    // Given: 元件渲染
    // When: 查看頁面
    // Then: 應顯示狀態篩選下拉選單
  });

  it("應該依選擇的狀態篩選清單", async () => {
    // Given: 清單中有不同狀態的漫畫
    // When: 選擇 "閱讀中"
    // Then: 應僅顯示閱讀中的漫畫
  });

  it("應該顯示當前篩選條件", async () => {
    // Given: 已選擇狀態篩選
    // When: 查看頁面
    // Then: 應顯示當前篩選條件標籤
  });

  it("應該能清除篩選條件", async () => {
    // Given: 已套用篩選
    // When: 點擊「清除篩選」
    // Then: 應顯示所有漫畫
  });
});
```

#### 2.4 排序功能測試

```typescript
describe("MangaList - 排序", () => {
  it("應該顯示排序選單", () => {
    // Given: 元件渲染
    // When: 查看頁面
    // Then: 應顯示排序下拉選單
  });

  it("應該依選擇的方式排序清單", async () => {
    // Given: 清單中有多本漫畫
    // When: 選擇 "評分(高至低)"
    // Then: 清單應依評分降序排列
  });
});
```

#### 2.5 響應式設計測試

```typescript
describe("MangaList - 響應式設計", () => {
  it("應該在桌面裝置顯示多欄網格", () => {
    // Given: 視窗寬度 ≥ 1024px
    // When: 元件渲染
    // Then: 卡片應以 3-4 欄網格排列
  });

  it("應該在行動裝置顯示單欄列表", () => {
    // Given: 視窗寬度 < 768px
    // When: 元件渲染
    // Then: 卡片應以單欄排列
  });
});
```

---

## 3️⃣ 元件測試: MangaCard.test.tsx

### 測試範圍

測試漫畫卡片元件的顯示和互動。

### 測試案例

#### 3.1 渲染測試

```typescript
describe("MangaCard - 渲染", () => {
  it("應該顯示漫畫名稱", () => {
    // Given: 漫畫資料包含名稱
    // When: 卡片渲染
    // Then: 應顯示漫畫名稱
  });

  it("應該顯示作者名稱", () => {
    // Given: 漫畫資料包含作者
    // When: 卡片渲染
    // Then: 應顯示作者名稱
  });

  it("應該顯示狀態標籤", () => {
    // Given: 漫畫狀態為 "閱讀中"
    // When: 卡片渲染
    // Then: 應顯示 "閱讀中" 標籤
    // And: 標籤應有對應的顏色
  });

  it("應該顯示閱讀進度", () => {
    // Given: 已讀 50 章,共 100 章
    // When: 卡片渲染
    // Then: 應顯示 "50/100 章"
  });

  it("應該顯示進度條(當有總章節數時)", () => {
    // Given: 漫畫有 totalChapters
    // When: 卡片渲染
    // Then: 應顯示進度條
    // And: 進度條應反映完成百分比
  });

  it("應該顯示評分(當有評分時)", () => {
    // Given: 漫畫評分為 9
    // When: 卡片渲染
    // Then: 應顯示 "9/10" 或星星圖示
  });

  it("應該顯示標籤", () => {
    // Given: 漫畫有標籤 ["冒險", "熱血"]
    // When: 卡片渲染
    // Then: 應顯示所有標籤
  });
});
```

#### 3.2 互動測試

```typescript
describe("MangaCard - 互動", () => {
  it("應該在點擊卡片時導航至詳情頁", async () => {
    // Given: 卡片渲染
    // When: 點擊卡片
    // Then: 應導航至漫畫詳情頁
  });

  it("應該在點擊編輯按鈕時開啟編輯表單", async () => {
    // Given: 卡片渲染
    // When: 點擊「編輯」按鈕
    // Then: 應開啟編輯表單
    // And: 表單應預填現有資料
  });

  it("應該在點擊刪除按鈕時顯示確認對話框", async () => {
    // Given: 卡片渲染
    // When: 點擊「刪除」按鈕
    // Then: 應顯示確認對話框
  });

  it("應該在確認刪除後移除漫畫", async () => {
    // Given: 點擊刪除並顯示確認對話框
    // When: 點擊「確認」
    // Then: 漫畫應從清單中移除
  });

  it("應該在取消刪除後保留漫畫", async () => {
    // Given: 點擊刪除並顯示確認對話框
    // When: 點擊「取消」
    // Then: 漫畫應保留在清單中
  });
});
```

#### 3.3 Hover 效果測試

```typescript
describe("MangaCard - Hover 效果", () => {
  it("應該在滑鼠移入時顯示 hover 效果", async () => {
    // Given: 卡片渲染
    // When: 滑鼠移入卡片
    // Then: 卡片應顯示陰影或縮放效果
  });
});
```

---

## 4️⃣ 元件測試: MangaForm.test.tsx

### 測試範圍

測試新增/編輯表單的驗證和提交邏輯。

### 測試案例

#### 4.1 渲染測試

```typescript
describe("MangaForm - 渲染", () => {
  it("應該渲染所有表單欄位", () => {
    // Given: 表單開啟
    // When: 渲染完成
    // Then: 應顯示所有欄位(名稱、作者、狀態等)
  });

  it("應該在新增模式顯示「新增漫畫」標題", () => {
    // Given: mode = 'create'
    // When: 表單渲染
    // Then: 應顯示「新增漫畫」標題
  });

  it("應該在編輯模式顯示「編輯漫畫」標題", () => {
    // Given: mode = 'edit'
    // When: 表單渲染
    // Then: 應顯示「編輯漫畫」標題
  });

  it("應該在編輯模式預填現有資料", () => {
    // Given: mode = 'edit' 且有現有漫畫資料
    // When: 表單渲染
    // Then: 所有欄位應預填現有值
  });
});
```

#### 4.2 驗證測試

```typescript
describe("MangaForm - 驗證", () => {
  it("應該要求漫畫名稱為必填", async () => {
    // Given: 表單開啟
    // When: 未填寫名稱就提交
    // Then: 應顯示錯誤訊息 "請輸入漫畫名稱"
    // And: 不應提交表單
  });

  it("應該要求狀態為必填", async () => {
    // Given: 表單開啟
    // When: 未選擇狀態就提交
    // Then: 應顯示錯誤訊息
  });

  it("應該驗證評分範圍(1-10)", async () => {
    // Given: 表單開啟
    // When: 輸入評分 11
    // Then: 應顯示錯誤訊息 "評分必須在 1-10 之間"
  });

  it("應該驗證已閱讀章節數不大於總章節數", async () => {
    // Given: 總章節數為 100
    // When: 輸入已閱讀章節數 150
    // Then: 應顯示錯誤訊息
  });

  it("應該驗證章節數為正整數", async () => {
    // Given: 表單開啟
    // When: 輸入負數或小數
    // Then: 應顯示錯誤訊息
  });
});
```

#### 4.3 提交測試

```typescript
describe("MangaForm - 提交", () => {
  it("應該在新增模式成功提交", async () => {
    // Given: 填寫所有必填欄位
    // When: 點擊「儲存」
    // Then: 應呼叫 addManga()
    // And: 應關閉表單
    // And: 應顯示成功訊息
  });

  it("應該在編輯模式成功提交", async () => {
    // Given: 修改現有漫畫資料
    // When: 點擊「儲存」
    // Then: 應呼叫 updateManga()
    // And: 應關閉表單
    // And: 應顯示成功訊息
  });

  it("應該在點擊取消時關閉表單", async () => {
    // Given: 表單開啟
    // When: 點擊「取消」
    // Then: 應關閉表單
    // And: 不應儲存任何變更
  });
});
```

---

## 5️⃣ 元件測試: MangaDetail.test.tsx

### 測試範圍

測試漫畫詳情頁面的顯示和操作。

### 測試案例

#### 5.1 渲染測試

```typescript
describe("MangaDetail - 渲染", () => {
  it("應該顯示所有漫畫資訊", () => {
    // Given: 有完整的漫畫資料
    // When: 詳情頁渲染
    // Then: 應顯示所有欄位(名稱、作者、狀態、進度、評分、標籤、筆記)
  });

  it("應該顯示完整筆記內容", () => {
    // Given: 漫畫有長篇筆記
    // When: 詳情頁渲染
    // Then: 應顯示完整筆記(支援換行)
  });

  it("應該在無筆記時顯示提示", () => {
    // Given: 漫畫無筆記
    // When: 詳情頁渲染
    // Then: 應顯示 "尚無筆記"
  });
});
```

#### 5.2 操作測試

```typescript
describe("MangaDetail - 操作", () => {
  it("應該提供編輯按鈕", () => {
    // Given: 詳情頁渲染
    // When: 查看頁面
    // Then: 應顯示「編輯」按鈕
  });

  it("應該提供刪除按鈕", () => {
    // Given: 詳情頁渲染
    // When: 查看頁面
    // Then: 應顯示「刪除」按鈕
  });

  it("應該提供返回清單按鈕", () => {
    // Given: 詳情頁渲染
    // When: 查看頁面
    // Then: 應顯示「返回清單」按鈕
  });
});
```

---

## 6️⃣ 整合測試

### 測試範圍

測試多個元件之間的協作和完整使用者流程。

### 測試案例

```typescript
describe("漫畫收藏 - 整合測試", () => {
  it("應該完成完整的新增流程", async () => {
    // 1. 進入漫畫收藏頁面
    // 2. 點擊「新增漫畫」
    // 3. 填寫表單
    // 4. 提交表單
    // 5. 驗證漫畫出現在清單中
  });

  it("應該完成完整的編輯流程", async () => {
    // 1. 點擊漫畫卡片的「編輯」
    // 2. 修改資料
    // 3. 提交表單
    // 4. 驗證資料已更新
  });

  it("應該完成完整的刪除流程", async () => {
    // 1. 點擊漫畫卡片的「刪除」
    // 2. 確認刪除
    // 3. 驗證漫畫已從清單移除
  });

  it("應該完成搜尋和篩選流程", async () => {
    // 1. 輸入搜尋關鍵字
    // 2. 選擇狀態篩選
    // 3. 驗證結果正確
  });

  it("應該在頁面重新載入後保留資料", async () => {
    // 1. 新增漫畫
    // 2. 重新載入頁面
    // 3. 驗證漫畫仍在清單中
  });
});
```

---

## 🎯 測試覆蓋率要求

### 最低覆蓋率標準

| 指標       | 目標  |
| ---------- | ----- |
| 語句覆蓋率 | ≥ 80% |
| 分支覆蓋率 | ≥ 75% |
| 函數覆蓋率 | ≥ 80% |
| 行覆蓋率   | ≥ 80% |

### 關鍵路徑 100% 覆蓋

以下功能必須達到 100% 測試覆蓋:

- CRUD 操作(新增、讀取、更新、刪除)
- LocalStorage 持久化邏輯
- 表單驗證邏輯
- 自動狀態更新(進度 100% → 已完成)

---

## 🔧 測試工具和設定

### 測試框架

- **Vitest**: 單元測試和整合測試
- **React Testing Library**: 元件測試
- **@testing-library/user-event**: 使用者互動模擬
- **@testing-library/jest-dom**: DOM 斷言

### Mock 設定

#### LocalStorage Mock

```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;
```

#### UUID Mock

```typescript
vi.mock("uuid", () => ({
  v4: () => "test-uuid-1234",
}));
```

---

## 📝 測試撰寫指南

### 1. 使用 AAA 模式

```typescript
it("應該新增漫畫", () => {
  // Arrange: 準備測試資料
  const manga = { title: "ONE PIECE", status: "reading" };

  // Act: 執行操作
  const result = addManga(manga);

  // Assert: 驗證結果
  expect(result).toBeDefined();
  expect(result.title).toBe("ONE PIECE");
});
```

### 2. 測試使用者行為,而非實作細節

✅ **好的做法**:

```typescript
expect(screen.getByRole("button", { name: /新增漫畫/i })).toBeInTheDocument();
```

❌ **避免**:

```typescript
expect(wrapper.find(".add-button")).toHaveLength(1);
```

### 3. 使用描述性的測試名稱

✅ **好的做法**:

```typescript
it('應該在漫畫名稱為空時顯示錯誤訊息', () => { ... });
```

❌ **避免**:

```typescript
it('測試驗證', () => { ... });
```

---

## 🚀 執行測試

### 基本命令

```bash
# 執行所有測試
pnpm test

# 監視模式
pnpm test -- --watch

# 執行特定測試檔案
pnpm test src/features/manga/MangaList.test.tsx

# 生成覆蓋率報告
pnpm test:coverage

# UI 模式
pnpm test:ui
```

### CI/CD 整合

```bash
# 在 CI 環境執行(無監視模式)
pnpm test -- --run

# 生成 JUnit 報告
pnpm test -- --reporter=junit --outputFile=test-results.xml
```

---

## 📚 參考資源

- [Vitest 文件](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library 最佳實踐](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [專案測試指南](../testing-guide.md)

---

Made with ❤️ and pixels
