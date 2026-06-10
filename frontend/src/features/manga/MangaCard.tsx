import React from 'react';
import type { Manga } from './types';
import { MANGA_STATUS_MAP } from './types';
import { StarRating } from '../../components/ui/StarRating';

interface MangaCardProps {
  manga: Manga;
  onClick: (manga: Manga) => void;
  onEdit: (manga: Manga) => void;
  onDelete: (manga: Manga) => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  onClick,
  onEdit,
  onDelete
}) => {
  const statusInfo = MANGA_STATUS_MAP[manga.status];

  // 計算進度百分比
  const progressPercent = manga.totalChapters
    ? Math.min(100, Math.round((manga.readChapters / manga.totalChapters) * 100))
    : 0;

  return (
    <div
      className="pixel-card group relative hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
      onClick={() => onClick(manga)}
    >
      {/* 狀態標籤 */}
      <div className={`absolute top-4 right-4 px-2 py-1 text-[10px] rounded-sm font-pixel border-2 border-current ${statusInfo.color} ${statusInfo.bgColor}`}>
        {statusInfo.label}
      </div>

      {/* 封面/圖示區域 (目前使用 placeholder) */}
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-bg-card-dark/5 dark:bg-bg-card-light/5 rounded-pixel-md">
        <span className="text-2xl">📖</span>
      </div>

      {/* 標題與作者 */}
      <h3 className="font-bold text-lg mb-1 truncate text-text-light dark:text-text-dark" title={manga.title}>
        {manga.title}
      </h3>
      {manga.author && (
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4 truncate">
          {manga.author}
        </p>
      )}

      {/* 進度條 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1 font-pixel text-text-muted-light dark:text-text-muted-dark">
          <span>已讀話數</span>
          <span>
            {manga.readChapters}
            {manga.totalChapters ? ` / ${manga.totalChapters}` : ''}
          </span>
        </div>
        {manga.totalChapters ? (
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
            <div
              className="h-full bg-pixel-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        ) : (
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden relative">
            <div className="h-full bg-gray-400 w-full opacity-20" />
          </div>
        )}
      </div>

      {/* 底部資訊: 評分與標籤 */}
      <div className="flex justify-between items-end">
        <div className="flex gap-1 flex-wrap">
          {manga.rating !== undefined && (
            <div className="flex items-center gap-1">
              <StarRating value={manga.rating / 2} readOnly size="sm" />
              <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark font-mono">({manga.rating})</span>
            </div>
          )}
        </div>
      </div>

      {/* 操作按鈕 (Hover 顯示) */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(manga);
          }}
          className="p-1.5 bg-white dark:bg-gray-800 border-2 border-text-light dark:border-text-dark rounded-sm hover:text-pixel-primary"
          title="編輯"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(manga);
          }}
          className="p-1.5 bg-white dark:bg-gray-800 border-2 border-text-light dark:border-text-dark rounded-sm hover:text-red-500"
          title="刪除"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
