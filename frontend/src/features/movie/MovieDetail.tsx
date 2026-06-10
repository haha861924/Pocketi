import React from 'react';
import type { Movie } from './types';
import { MOVIE_STATUS_MAP } from './types';
import { StarRating } from '../../components/ui/StarRating';

interface MovieDetailProps {
  movie: Movie | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ movie, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !movie) return null;

  const statusInfo = MOVIE_STATUS_MAP[movie.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card-light dark:bg-bg-card-dark w-full max-w-2xl rounded-pixel-lg border-3 border-text-light dark:border-text-dark shadow-pixel max-h-[90vh] overflow-y-auto">
        {/* 頭部 */}
        <div className="relative p-6 md:p-8 border-b-2 border-text-light dark:border-text-dark">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark text-xl"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-bg-card-dark/5 dark:bg-bg-card-light/5 rounded-pixel-md flex items-center justify-center overflow-hidden">
              {movie.thumbnailUrl ? (
                <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🎬</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs rounded-sm font-pixel border border-current ${statusInfo.color} ${statusInfo.bgColor}`}>
                  {statusInfo.label}
                </span>
                {movie.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <StarRating value={movie.rating / 2} readOnly size="sm" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-text-light dark:text-text-dark">
                {movie.title}
              </h2>

              {movie.director && (
                <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-4">
                  導演: {movie.director}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {movie.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark rounded-sm text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 內容 */}
        <div className="p-6 md:p-8 space-y-8">
          {movie.notes && (
            <div>
              <h3 className="font-pixel text-lg text-pixel-primary mb-4 border-b-2 border-dashed border-pixel-primary/30 pb-2">
                心得筆記
              </h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark text-text-light dark:text-text-dark whitespace-pre-wrap leading-relaxed">
                {movie.notes}
              </div>
            </div>
          )}

          <div className="text-xs text-text-muted-light dark:text-text-muted-dark text-right font-mono">
            <p>建立於: {new Date(movie.createdAt).toLocaleDateString()}</p>
            <p>最後更新: {new Date(movie.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-black/20 flex justify-end gap-4 border-t-2 border-text-light dark:border-text-dark">
          <button
            onClick={() => onDelete(movie)}
            className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-pixel-sm transition-colors"
          >
            刪除
          </button>
          <button
            onClick={() => onEdit(movie)}
            className="pixel-button pixel-button-primary px-6"
          >
            編輯
          </button>
        </div>
      </div>
    </div>
  );
};
