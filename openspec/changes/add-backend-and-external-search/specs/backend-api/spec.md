## ADDED Requirements

### Requirement: 收藏 CRUD API

後端 MUST 提供 RESTful API 讓前端管理使用者收藏，所有端點需要 Bearer JWT 驗證。

#### Scenario: 取得收藏清單

- **WHEN** 已驗證使用者向 `GET /api/collections` 發送請求（可附帶 `?type=manga&status=reading&q=` 篩選參數）
- **THEN** 系統回傳 200 和屬於該使用者的收藏陣列
- **AND** 支援 `type`（manga/movie/book）、`status`、關鍵字 `q` 篩選
- **AND** 回傳欄位包含 id, type, title, author, status, readChapters, totalChapters, rating, tags, notes, thumbnailUrl, createdAt, updatedAt

#### Scenario: 新增收藏項目

- **WHEN** 已驗證使用者向 `POST /api/collections` 發送請求，body 包含 type 和 title（必填），其餘選填
- **THEN** 系統建立新收藏並回傳 201 與完整項目資料
- **AND** 可選傳入 externalId 與 thumbnailUrl（來自外部搜尋結果）

#### Scenario: 更新收藏項目

- **WHEN** 已驗證使用者向 `PATCH /api/collections/{id}` 發送請求，body 包含要更新的欄位
- **THEN** 系統更新對應項目並回傳 200 與更新後的資料
- **AND** 若 readChapters 達到 totalChapters 且 totalChapters > 0，系統自動將 status 改為 `completed`
- **AND** 若 id 不屬於該使用者，回傳 404

#### Scenario: 刪除收藏項目

- **WHEN** 已驗證使用者向 `DELETE /api/collections/{id}` 發送請求
- **THEN** 系統刪除對應項目並回傳 204
- **AND** 若 id 不屬於該使用者，回傳 404

### Requirement: API 錯誤處理

後端 API MUST 以標準化格式回傳錯誤，便於前端統一處理。

#### Scenario: 未驗證存取

- **WHEN** 請求未帶有效 Authorization header
- **THEN** 系統回傳 401 `{"detail": "Not authenticated"}`

#### Scenario: 驗證錯誤

- **WHEN** 請求 body 缺少必填欄位或型別錯誤
- **THEN** 系統回傳 422 Unprocessable Entity，detail 陣列說明各欄位錯誤
