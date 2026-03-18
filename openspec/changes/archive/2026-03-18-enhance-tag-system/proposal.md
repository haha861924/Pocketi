# 增強標籤系統 (Global Tag History)

## 變更說明

本提案旨在建立一個獨立的全域標籤歷史系統，確保使用者曾輸入過的標籤能被永久保存並可供重複使用，即使該標籤目前未被任何漫畫使用。

## 變更動機

使用者回饋指出，目前的標籤建議僅基於現有漫畫資料，導致：

1. 切換編輯不同漫畫時，尚未保存的標籤輸入可能遺失。
2. 若刪除唯一使用某標籤的漫畫，該標籤記錄即消失，未來無法透過自動完成快速輸入。
3. 使用者希望建立一個累積性的標籤庫，方便管理與重複使用。

## 影響範圍

- `src/features/manga/useMangaStore.ts`:
  - 新增 `tagHistory` 狀態與 LocalStorage 持久化 (`pocketit_tags_history_v1`)。
  - 實作 `addTagToHistory` 方法，在新增/更新漫畫時自動收集標籤。
  - 更新 `getAllTags` 改為合併 `tagHistory` 與現有漫畫標籤（或直接使用 `tagHistory`）。
- `src/features/manga/MangaForm.tsx`:
  - 提交時呼叫 `addTagToHistory`。
  - `TagInput` 的建議列表改為使用全域歷史標籤。
- `src/components/ui/TagInput.tsx`:
  - 優化建議列表顯示邏輯（如使用者所述，歷史 tag 要用下拉表示）。

## 風險評估

- 需要遷移現有資料：初次執行時，應從所有現有漫畫中提取標籤並初始化 `tagHistory`。
- 標籤清理機制：目前不包含刪除歷史標籤的功能，可能會導致下拉選單無限增長。建議未來考慮加入「管理標籤」功能，本提案暫不包含。
