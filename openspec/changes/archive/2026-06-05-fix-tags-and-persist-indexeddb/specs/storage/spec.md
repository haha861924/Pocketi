# 儲存層遷移規格 (IndexedDB)

## ADDED Requirements

### Requirement: IndexedDB 持久化

The system MUST use IndexedDB for persisting manga data and tag history, replacing LocalStorage.
(系統必須使用 IndexedDB 來持久化漫畫資料與標籤歷史，取代 LocalStorage。)

#### Scenario: 資料儲存

當使用者新增或更新漫畫時，資料應非同步寫入 IndexedDB 的 `pocketit-store` 資料庫。

#### Scenario: 資料遷移

當系統檢測到 LocalStorage 存有舊資料且 IndexedDB 為空時，應自動將舊資料遷移至 IndexedDB。
