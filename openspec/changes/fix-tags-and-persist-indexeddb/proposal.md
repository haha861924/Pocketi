# 標籤記錄修復與 IndexedDB 遷移提案

## 變更說明

1. **全域標籤記錄修復**: 解決「歷史記錄只記錄了一個 tag」的問題，確保每次新增或編輯漫畫時，所有的標籤都能正確合併至全域歷史中。
2. **遷移至 IndexedDB**: 將資料儲存層從 LocalStorage 遷移至 IndexedDB，以支援更大量的數據存儲，並為未來可能的資料庫整合做準備。

## 變更動機

- **標籤遺失問題**: 使用者反饋目前的標籤歷史記錄不完整，無法正確列出所有曾使用過的標籤。
- **儲存容量與效能**: 隨著漫畫收藏數量增加，LocalStorage 的 5MB 限制與同步讀寫特性可能成為瓶頸。IndexedDB 提供非同步操作與更大的儲存空間。

## 影響範圍

- `src/features/manga/useMangaStore.ts`:
  - 引入 `idb-keyval` (或其他輕量 IndexedDB wrapper)。
  - 重構資料載入與儲存邏輯為非同步 (Async)。
  - 修正 `addTagToHistory` 邏輯，確保無遺漏。
- `src/features/manga/MangaForm.tsx` & `MangaDetail.tsx`:
  - 配合 Store 的改變進行測試與微調 (若有介面變動)。
- **資料遷移**: 需實作從 `localStorage` 遷移資料至 `IndexedDB` 的一次性邏輯。

## 技術選擇

- 建議使用 `idb-keyval` 庫，因其 API 簡單 (get/set) 且足夠滿足目前的 Key-Value 儲存需求，無需引入複雜的 DB Schema 管理。
