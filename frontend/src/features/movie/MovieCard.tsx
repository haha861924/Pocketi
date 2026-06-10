import React from 'react';
import type { Movie } from './types';
import { MOVIE_STATUS_MAP } from './types';
import { StarRating } from '../../components/ui/StarRating';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onEdit, onDelete }) => {
  const statusInfo = MOVIE_STATUS_MAP[movie.status];

  return (
    <div
      className="pixel-card group relative hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
      onClick={() => onClick(movie)}
    >
      {/* 狀態標籤 */}
      <div className={`absolute top-4 right-4 px-2 py-1 text-[10px] rounded-sm font-pixel border-2 border-current ${statusInfo.color} ${statusInfo.bgColor}`}>
        {statusInfo.label}
      </div>

      {/* 封面 */}
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-bg-card-dark/5 dark:bg-bg-card-light/5 rounded-pixel-md overflow-hidden">
        {movie.thumbnailUrl ? (
          <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🎬</span>
        )}
      </div>

      {/* 標題與導演 */}
      <h3 className="font-bold text-lg mb-1 truncate text-text-light dark:text-text-dark" title={movie.title}>
        {movie.title}
      </h3>
      {movie.director && (
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4 truncate">
          {movie.director}
        </p>
      )}

      {/* 評分 */}
      <div className="flex justify-between items-end">
        {movie.rating !== undefined && (
          <div className="flex items-center gap-1">
            <StarRating value={movie.rating / 2} readOnly size="sm" />
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark font-mono">({movie.rating})</span>
          </div>
        )}
      </div>

      {/* 標籤 */}
      {movie.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-3">
          {movie.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-sm text-text-muted-light dark:text-text-muted-dark">
              #{tag}
            </span>
          ))}
          {movie.tags.length > 3 && (
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">+{movie.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* 操作按鈕 (Hover) */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(movie); }}
          className="p-1.5 bg-white dark:bg-gray-800 border-2 border-text-light dark:border-text-dark rounded-sm hover:text-pixel-primary"
          title="編輯"
        >
          ✏️
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(movie); }}
          className="p-1.5 bg-white dark:bg-gray-800 border-2 border-text-light dark:border-text-dark rounded-sm hover:text-red-500"
          title="刪除"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
