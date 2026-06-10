## ADDED Requirements

### Requirement: 使用者帳號註冊

系統 MUST 允許新使用者透過 Email 和密碼建立帳號，作為收藏資料與個人帳戶綁定的基礎。

#### Scenario: 成功註冊

- **WHEN** 使用者向 `POST /api/auth/register` 發送 `{"email": "...", "password": "..."}`
- **THEN** 系統建立新使用者帳號，密碼以 bcrypt 雜湊儲存
- **AND** 系統回傳 201 與 JWT access token 及 token_type
- **AND** Email 格式不合法時回傳 422 錯誤

#### Scenario: Email 已存在

- **WHEN** 使用者嘗試以已存在的 Email 註冊
- **THEN** 系統回傳 409 `{"detail": "Email already registered"}`

### Requirement: 使用者登入與 JWT 驗證

系統 MUST 提供 JWT 驗證機制，使所有收藏資料 API 僅能被已驗證的使用者存取。

#### Scenario: 成功登入

- **WHEN** 使用者向 `POST /api/auth/login` 發送正確的 email 和 password
- **THEN** 系統驗證密碼並回傳 200 與 JWT access token（有效期 7 天）
- **AND** 前端將 token 存於 localStorage 並在後續請求加入 `Authorization: Bearer <token>` header

#### Scenario: 登入失敗

- **WHEN** 使用者提供錯誤的 email 或 password
- **THEN** 系統回傳 401 `{"detail": "Invalid credentials"}`
- **AND** 不暴露是 email 還是 password 不正確

#### Scenario: Token 過期或無效

- **WHEN** 前端帶入已過期或被竄改的 JWT 存取 API
- **THEN** 系統回傳 401 `{"detail": "Token expired or invalid"}`
- **AND** 前端偵測到 401 後清除本地 token 並引導使用者重新登入
