# 實作任務清單

## 1. 基礎建設 (IndexedDB)

- [ ] 1.1 安裝 `idb-keyval` 套件
- [ ] 1.2 在 `useMangaStore` 中實作 `loadFromDB` 與 `saveToDB` 函數
- [ ] 1.3 實作 Migration 邏輯：啟動時檢查 LocalStorage，若有資料則遷移至 IndexedDB 並清空 LocalStorage

## 2. 標籤記錄修復

- [ ] 2.1 審查並重構 `addTagToHistory` 邏輯，確保陣列合併與去重複正確無誤
- [ ] 2.2 確保 `init` 階段從 IndexedDB 載入完整標籤歷史
- [ ] 2.3 驗證多標籤輸入時的儲存行為

## 3. Store 重構 (Async Support)

- [ ] 3.1 將 `useMangaStore` 的初始化改為完整非同步
- [ ] 3.2 確保 UI 在資料載入前維持 `isLoading` 狀態

## 4. 驗證

- [ ] 4.1 驗證標籤下拉選單包含所有歷史標籤
- [ ] 4.2 驗證重新整理後資料從 IndexedDB 正確載入
- [ ] 4.3 驗證舊 LocalStorage 資料成功遷移
