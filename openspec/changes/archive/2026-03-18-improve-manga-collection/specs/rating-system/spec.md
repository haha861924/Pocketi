# 評分機制升級規格

## MODIFIED Requirements

### Requirement: 5 星評分系統

The system MUST replace the numeric input with an intuitive star rating component.
(系統必須將評分機制從數字輸入改為直覺的星星互動元件。)

#### Scenario: 評分輸入 UI

表單中的評分輸入應改為 5 顆星星的互動元件。

- 支援滑鼠懸停預覽
- 支援點擊設定評分
- 支援半顆星的精確度（例如 3.5 星）

#### Scenario: 評分範圍與轉換

評分值範圍應調整為 0-5（或是 0-10 內部儲存，顯示時換算）。

- 為了相容性，建議維持內部 0-10 分，但 UI 顯示為 0-5 星（1 星 = 2 分）。
- 或者直接改為 0-5 分制，並遷移舊資料。
- **決定**：維持 0-10 分儲存以保持資料精度，UI 層面處理除以 2 的顯示邏輯。半顆星對應 1 分。

### Requirement: 評分唯讀狀態

The system MUST ensure ratings are read-only in view mode to prevent accidental edits.
(系統必須確保在瀏覽模式下評分不會被意外修改。)

#### Scenario: 非編輯模式唯讀

在漫畫詳情頁（MangaDetail）或卡片上，評分顯示應為唯讀，使用者點擊星星不應觸發評分更新（除非進入編輯模式）。
