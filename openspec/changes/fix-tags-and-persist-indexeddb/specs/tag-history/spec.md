# 標籤歷史修復規格

## MODIFIED Requirements

### Requirement: 完整標籤歷史記錄

The system MUST record ALL unique tags entered by the user into the global history dropdown list.
(系統必須將使用者輸入的所有唯一標籤記錄至全域歷史下拉清單中。)

#### Scenario: 多標籤儲存

當使用者在單次編輯中輸入多個標籤（例如 "A", "B", "C"）並儲存後，下次打開下拉選單時，這三個標籤都必須存在於建議列表中。

#### Scenario: 歷史列表顯示

下拉選單應顯示所有累積的歷史標籤，不應有遺漏。
