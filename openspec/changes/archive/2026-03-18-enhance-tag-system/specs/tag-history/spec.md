# 全域標籤歷史規格

## ADDED Requirements

### Requirement: 標籤歷史持久化

The system MUST persist a global history of all tags ever used or entered, independent of current manga data.
(系統必須持久化所有曾使用或輸入過的全域標籤歷史，獨立於目前的漫畫資料。)

#### Scenario: 跨編輯保存

當使用者在漫畫 A 輸入標籤 "Cyberpunk" 並儲存後，切換至編輯漫畫 B 時，輸入框的建議列表應包含 "Cyberpunk"。

#### Scenario: 刪除保留

當使用者刪除所有包含標籤 "Fantasy" 的漫畫後，"Fantasy" 仍應保留在全域標籤歷史中，並可透過自動完成再次使用。

### Requirement: 自動收集標籤

The system MUST automatically add new tags to the global history upon manga creation or update.
(系統必須在建立或更新漫畫時，自動將新標籤加入全域歷史。)

#### Scenario: 表單提交收集

當使用者提交漫畫表單時，系統應檢查並收集該漫畫的所有標籤至全域歷史庫，排除重複項目。
