/**
 * 電影收藏功能的 TypeScript 型別定義
 */

export type MovieStatus =
  | 'want-to-watch'  // 想看
  | 'watching'       // 觀看中（影集）
  | 'completed'      // 已看完
  | 'on-hold'        // 暫停
  | 'dropped';       // 放棄

export interface Movie {
  id: string;
  title: string;
  director?: string;
  status: MovieStatus;
  rating?: number;       // 1-10
  tags: string[];
  notes?: string;
  thumbnailUrl?: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieInput {
  title: string;
  director?: string;
  status: MovieStatus;
  rating?: number;
  tags?: string[];
  notes?: string;
  thumbnailUrl?: string;
  externalId?: string;
}

export interface UpdateMovieInput {
  title?: string;
  director?: string;
  status?: MovieStatus;
  rating?: number;
  tags?: string[];
  notes?: string;
}

export interface MovieFilterOptions {
  searchQuery?: string;
  status?: MovieStatus;
  minRating?: number;
  maxRating?: number;
  tags?: string[];
}

export type MovieSortOption =
  | 'createdAt-desc'
  | 'createdAt-asc'
  | 'updatedAt-desc'
  | 'updatedAt-asc'
  | 'title-asc'
  | 'title-desc'
  | 'rating-desc'
  | 'rating-asc';

export interface MovieStatusInfo {
  label: string;
  color: string;
  bgColor: string;
}

export const MOVIE_STATUS_MAP: Record<MovieStatus, MovieStatusInfo> = {
  'want-to-watch': {
    label: '想看',
    color: 'text-pixel-accent',
    bgColor: 'bg-pixel-accent/10'
  },
  'watching': {
    label: '觀看中',
    color: 'text-pixel-primary',
    bgColor: 'bg-pixel-primary/10'
  },
  'completed': {
    label: '已看完',
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

export const MOVIE_SORT_OPTIONS: { value: MovieSortOption; label: string }[] = [
  { value: 'updatedAt-desc', label: '最近更新' },
  { value: 'createdAt-desc', label: '新增時間 (最新)' },
  { value: 'createdAt-asc', label: '新增時間 (最舊)' },
  { value: 'title-asc', label: '名稱 (A-Z)' },
  { value: 'title-desc', label: '名稱 (Z-A)' },
  { value: 'rating-desc', label: '評分 (高至低)' },
  { value: 'rating-asc', label: '評分 (低至高)' }
];
