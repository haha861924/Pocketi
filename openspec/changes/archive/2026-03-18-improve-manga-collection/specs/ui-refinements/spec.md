# UI 與文案調整規格

## MODIFIED Requirements

### Requirement: 文案調整

The system MUST unify interface terminology to eliminate ambiguity.
(系統必須統一介面用語，消除歧義。)

#### Scenario: 已讀標籤更新

將介面上所有的「已讀章節」文字標籤更改為「已讀話數」（或「已讀話數/卷數」以涵蓋不同情境，依使用者偏好「已讀話數」優先）。

### Requirement: 樣式優化

The system MUST refine interface details to improve visual polish.
(系統必須微調介面細節以提升視覺精緻度。)

#### Scenario: 下拉選單間距

編輯表單中的狀態下拉選單（Select）應增加右側內距（Padding Right），避免下拉箭頭 Icon 與邊框過於貼近。建議至少增加 2px 或使用自訂樣式確保視覺舒適度。

### Requirement: 筆記輸入優化

The system MUST enhance the notes input with constraints and visual feedback.
(系統必須增強筆記輸入框的功能與提示。)

#### Scenario: 字數限制與提示

筆記輸入框應限制最大字數為 200 字。

- 顯示當前字數/最大字數計數器（例如：150/200）。
- 當字數超過 200 字時，輸入框邊框應變為紅色以示警告。
