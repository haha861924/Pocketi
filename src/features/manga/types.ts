/**
 * 漫畫收藏功能的 TypeScript 型別定義
 */

/**
 * 漫畫閱讀狀態
 */
export type MangaStatus =
  | 'want-to-read'  // 想看
  | 'reading'       // 閱讀中
  | 'completed'     // 已完成
  | 'on-hold'       // 暫停
  | 'dropped';      // 放棄

/**
 * 漫畫資料模型
 */
export interface Manga {
  /** 唯一識別碼 (UUID) */
  id: string;

  /** 漫畫名稱 (必填) */
  title: string;

  /** 作者 (選填) */
  author?: string;

  /** 閱讀狀態 (必填) */
  status: MangaStatus;

  /** 總章節數或卷數 (選填) */
  totalChapters?: number;

  /** 已閱讀章節數或卷數 (預設 0) */
  readChapters: number;

  /** 評分 1-10 分 (選填) */
  rating?: number;

  /** 標籤 (預設空陣列) */
  tags: string[];

  /** 筆記 (選填) */
  notes?: string;

  /** 建立時間 (ISO 8601 格式) */
  createdAt: string;

  /** 更新時間 (ISO 8601 格式) */
  updatedAt: string;
}

/**
 * 新增漫畫的輸入資料 (不包含自動生成的欄位)
 */
export interface CreateMangaInput {
  title: string;
  author?: string;
  status: MangaStatus;
  totalChapters?: number;
  readChapters?: number;
  rating?: number;
  tags?: string[];
  notes?: string;
}

/**
 * 更新漫畫的輸入資料 (所有欄位都是選填)
 */
export interface UpdateMangaInput {
  title?: string;
  author?: string;
  status?: MangaStatus;
  totalChapters?: number;
  readChapters?: number;
  rating?: number;
  tags?: string[];
  notes?: string;
}

/**
 * 搜尋與篩選條件
 */
export interface MangaFilterOptions {
  /** 關鍵字搜尋 (搜尋名稱和作者) */
  searchQuery?: string;

  /** 依狀態篩選 */
  status?: MangaStatus;

  /** 依評分範圍篩選 */
  minRating?: number;
  maxRating?: number;

  /** 依標籤篩選 */
  tags?: string[];
}

/**
 * 排序選項
 */
export type MangaSortOption =
  | 'createdAt-desc'   // 新增時間 (最新優先)
  | 'createdAt-asc'    // 新增時間 (最舊優先)
  | 'updatedAt-desc'   // 更新時間 (最近更新)
  | 'updatedAt-asc'    // 更新時間 (最久未更新)
  | 'title-asc'        // 名稱 (A-Z)
  | 'title-desc'       // 名稱 (Z-A)
  | 'rating-desc'      // 評分 (高至低)
  | 'rating-asc';      // 評分 (低至高)

/**
 * LocalStorage 儲存格式
 */
export interface MangaStorageData {
  /** 資料版本號 */
  version: string;

  /** 漫畫清單 */
  mangas: Manga[];
}

/**
 * 狀態標籤的顯示資訊
 */
export interface MangaStatusInfo {
  label: string;
  color: string;
  bgColor: string;
}

/**
 * 狀態標籤映射
 */
export const MANGA_STATUS_MAP: Record<MangaStatus, MangaStatusInfo> = {
  'want-to-read': {
    label: '想看',
    color: 'text-pixel-accent',
    bgColor: 'bg-pixel-accent/10'
  },
  'reading': {
    label: '閱讀中',
    color: 'text-pixel-primary',
    bgColor: 'bg-pixel-primary/10'
  },
  'completed': {
    label: '已完成',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-600/10'
  },
  'on-hold': {
    label: '暫停',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-600/10'
  },
  'dropped': {
    label: '放棄',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-600/10'
  }
};

/**
 * 排序選項的顯示資訊
 */
export const MANGA_SORT_OPTIONS: { value: MangaSortOption; label: string }[] = [
  { value: 'updatedAt-desc', label: '最近更新' },
  { value: 'createdAt-desc', label: '新增時間 (最新)' },
  { value: 'createdAt-asc', label: '新增時間 (最舊)' },
  { value: 'title-asc', label: '名稱 (A-Z)' },
  { value: 'title-desc', label: '名稱 (Z-A)' },
  { value: 'rating-desc', label: '評分 (高至低)' },
  { value: 'rating-asc', label: '評分 (低至高)' }
];
