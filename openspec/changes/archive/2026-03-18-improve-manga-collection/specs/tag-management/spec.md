# 標籤管理優化規格

## MODIFIED Requirements

### Requirement: 標籤輸入與儲存優化

The system MUST optimize the tag input experience, including autocomplete and auto-save.
(系統必須優化標籤輸入的使用體驗，包含自動完成與防呆儲存。)

#### Scenario: 自動完成標籤

當使用者在標籤輸入框輸入文字時，應顯示包含該文字的現有標籤建議列表（Dropdown）。使用者可以點擊或使用鍵盤選擇建議標籤。

#### Scenario: 確保標籤儲存

當使用者按下「儲存變更」或「新增漫畫」按鈕時，如果標籤輸入框中有未按 Enter 的文字，應自動將其視為一個標籤並儲存（或提示使用者確認）。

#### Scenario: 標籤建議來源

標籤建議列表應來源於系統中所有已存在的漫畫標籤集合（全域標籤池）。
