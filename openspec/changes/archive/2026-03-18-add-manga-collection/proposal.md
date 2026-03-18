# Change: 新增漫畫收藏功能

## Why

Pocketit 是一個個人收藏管理平台,目前已有 Landing Page 展示六大核心功能,其中「漫畫收藏」是重要的核心功能之一。許多使用者需要追蹤正在閱讀的漫畫、記錄閱讀進度、管理想看的漫畫清單,以及掌握最新連載資訊。本變更將實作完整的漫畫收藏管理功能,讓使用者能夠有效地整理和追蹤他們的漫畫閱讀歷程。

## What Changes

- 建立全新的漫畫收藏管理功能,包含以下核心能力:
  - **漫畫清單管理**: 新增、編輯、刪除漫畫項目
  - **閱讀進度追蹤**: 記錄已閱讀的章節/卷數
  - **狀態分類**: 支援「想看」、「閱讀中」、「已完成」、「暫停」等狀態
  - **評分與筆記**: 為漫畫評分並記錄個人心得
  - **搜尋與篩選**: 依狀態、評分、標籤等條件篩選漫畫
  - **資料持久化**: 使用 LocalStorage 儲存資料(未來可擴展至後端)

- 採用專案既有的像素風格設計系統:
  - 使用 TailwindCSS 和自訂 pixel 樣式類別
  - 支援深色/淺色模式
  - 響應式設計,支援行動裝置
  - 使用 Press Start 2P 和 Space Mono 字體

- 遵循 SDD (Specification-Driven Development) 原則:
  - 先撰寫功能 README 文件
  - 先撰寫測試規格文件
  - 再實作功能程式碼

## Impact

- Affected specs: `manga-collection` (新增)
- Affected code:
  - `src/App.tsx` - 新增路由和導覽邏輯
  - `src/features/manga/` (新增) - 漫畫收藏功能模組
    - `MangaList.tsx` - 漫畫清單元件
    - `MangaCard.tsx` - 漫畫卡片元件
    - `MangaForm.tsx` - 新增/編輯表單元件
    - `MangaDetail.tsx` - 漫畫詳情元件
    - `useMangaStore.ts` - 狀態管理 Hook
    - `types.ts` - TypeScript 型別定義
  - `docs/features/manga-collection.md` (新增) - 功能文件
  - `docs/testing/manga-collection-test-spec.md` (新增) - 測試規格
  - 測試檔案 (新增):
    - `src/features/manga/MangaList.test.tsx`
    - `src/features/manga/MangaCard.test.tsx`
    - `src/features/manga/MangaForm.test.tsx`
    - `src/features/manga/useMangaStore.test.ts`
