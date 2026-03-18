# 標籤介面優化規格

## MODIFIED Requirements

### Requirement: 下拉選單顯示邏輯

The system MUST display the tag suggestion dropdown whenever the input is focused, showing history tags.
(系統必須在輸入框聚焦時顯示標籤建議下拉選單，展示歷史標籤。)

#### Scenario: 空輸入顯示

當使用者點擊標籤輸入框但尚未輸入任何文字時，應展開下拉選單並顯示最近使用或所有的歷史標籤。

#### Scenario: 歷史標籤過濾

當使用者輸入文字時，下拉選單應根據輸入內容即時過濾歷史標籤。
