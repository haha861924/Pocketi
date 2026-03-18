# 增強標籤系統 - 實作任務清單

## 1. 核心邏輯 (useMangaStore)

- [ ] 1.1 定義 `TagHistory` 型別與 Storage Key
- [ ] 1.2 實作 `tagHistory` 狀態管理與持久化
- [ ] 1.3 實作 `initializeTagHistory`：從現有漫畫資料與 LocalStorage 初始化
- [ ] 1.4 實作 `addToTagHistory`：接收新標籤並去重複儲存

## 2. 介面整合 (MangaForm & TagInput)

- [ ] 2.1 修改 `MangaForm`：在提交表單時，將所有標籤（包含新輸入的）加入歷史記錄
- [ ] 2.2 修改 `TagInput`：確保下拉選單總是顯示（點擊輸入框即顯示歷史建議，即使用戶尚未輸入文字）
- [ ] 2.3 優化 `TagInput` 下拉選單樣式與互動體驗

## 3. 驗證

- [ ] 3.1 驗證新增漫畫後，新標籤會立即出現在其他漫畫編輯的建議列表中
- [ ] 3.2 驗證刪除漫畫後，其獨有標籤仍保留在建議列表中
- [ ] 3.3 驗證重新整理頁面後，標籤歷史仍存在
