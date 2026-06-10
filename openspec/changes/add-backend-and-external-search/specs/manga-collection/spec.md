## MODIFIED Requirements

### Requirement: 資料持久化

系統 MUST 使用後端 PostgreSQL 資料庫儲存漫畫資料，取代 LocalStorage，確保資料跨裝置同步。
（系統 SHALL 使用 LocalStorage 儲存漫畫資料，確保資料在頁面重新載入後仍然存在。）

#### Scenario: 資料儲存

- **WHEN** 使用者新增、編輯或刪除漫畫
- **THEN** 前端向後端 API 发送對應 HTTP 請求（POST/PATCH/DELETE /api/collections）
- **AND** 後端將變更持久化至 PostgreSQL 資料庫
- **AND** API 回應成功後前端更新本地 UI 狀態

#### Scenario: 資料載入

- **WHEN** 使用者進入漫畫收藏頁面或重新載入頁面
- **THEN** 前端向 `GET /api/collections?type=manga` 取得資料
- **AND** 若 API 不可用（離線或後端錯誤），前端顯示錯誤提示並顯示上次快取的資料（若有）
- **AND** 若資料庫無資料，顯示空狀態提示

#### Scenario: 資料格式

- **WHEN** 系統儲存資料至資料庫
- **THEN** 每個漫畫項目包含唯一 UUID
- **AND** 包含 createdAt / updatedAt 時間戳記（由資料庫管理）
- **AND** 可選儲存 externalId 以關聯第三方資料來源

## ADDED Requirements

### Requirement: 從外部搜尋加入漫畫

系統 MUST 允許使用者透過外部搜尋找到漫畫作品，並一鍵加入收藏，取代純手動輸入流程。

#### Scenario: 搜尋並加入

- **WHEN** 使用者在收藏頁面點擊「搜尋新增」
- **THEN** 系統顯示搜尋面板，預設 type 為 manga
- **AND** 使用者輸入關鍵字後，系統即時顯示 MyAnimeList 搜尋結果（含封面縮圖、標題、作者）
- **AND** 使用者點擊結果卡片上的「加入收藏」後，系統以預填資訊建立收藏項目，status 預設為「想看」
