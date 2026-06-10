## ADDED Requirements

### Requirement: 外部作品搜尋

系統 MUST 提供統一搜尋 API，透過後端 Proxy 串接第三方平台，讓使用者搜尋真實作品並加入收藏。

#### Scenario: 搜尋漫畫

- **WHEN** 使用者向 `GET /api/search?q=naruto&type=manga` 發送請求
- **THEN** 後端向 MyAnimeList API 查詢並回傳統一格式結果陣列
- **AND** 每筆結果包含 externalId, type, title, originalTitle, thumbnail, description, author, year, score

#### Scenario: 搜尋電影

- **WHEN** 使用者向 `GET /api/search?q=inception&type=movie` 發送請求
- **THEN** 後端向 TMDB API 查詢並回傳統一格式結果陣列
- **AND** 結果中 author 欄位對應導演姓名（若可取得）

#### Scenario: 搜尋書籍

- **WHEN** 使用者向 `GET /api/search?q=atomic+habits&type=book` 發送請求
- **THEN** 後端向 Google Books API 查詢並回傳統一格式結果陣列
- **AND** 結果中 author 欄位對應書籍作者（可能有多位，以逗號分隔）

#### Scenario: 從搜尋結果加入收藏

- **WHEN** 使用者在搜尋結果中點擊「加入收藏」
- **THEN** 前端向 `POST /api/collections` 發送請求，帶入 externalId, type, title, author, thumbnailUrl 等搜尋結果欄位
- **AND** 後端建立收藏並設定 status 為預設值 `want`

#### Scenario: 第三方 API 不可用

- **WHEN** 第三方 API 回應失敗或超時（逾時門檻：5 秒）
- **THEN** 後端回傳 502 `{"detail": "External API unavailable, please try again later."}`
- **AND** 不暴露第三方 API 的原始錯誤詳細資訊

### Requirement: 搜尋結果快取

系統 MUST 對相同關鍵字的搜尋結果進行短暫快取（記憶體內，TTL 60 秒），降低對第三方 API 的請求頻率。

#### Scenario: 重複搜尋快取命中

- **WHEN** 同一關鍵字在 60 秒內被重複搜尋
- **THEN** 系統從記憶體快取回傳先前結果，不發出外部請求
- **AND** 快取容量上限為 100 組不重複的搜尋組合（q + type）
