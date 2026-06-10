import React, { useState } from 'react';
import { api, ApiError } from '../../lib/api';

interface SearchResult {
  external_id: string;
  type: string;
  title: string;
  original_title: string | null;
  thumbnail: string | null;
  description: string | null;
  author: string | null;
  year: number | null;
  score: number | null;
}

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (result: SearchResult) => void;
  defaultType?: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose, onAdd, defaultType = 'manga' }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState(defaultType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await api.get<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
      setResults(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('搜尋失敗，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50 overflow-y-auto">
      <div className="bg-bg-card-light dark:bg-bg-card-dark border-2 border-text-light dark:border-text-dark rounded-pixel-lg shadow-pixel-hover w-full max-w-2xl mx-4 mb-8">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-text-muted-light dark:border-text-muted-dark">
          <h2 className="text-lg font-pixel text-text-light dark:text-text-dark">搜尋作品</h2>
          <button onClick={onClose} className="text-text-muted-light dark:text-text-muted-dark hover:text-pixel-primary text-xl">&times;</button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-4 space-y-3">
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
            >
              <option value="manga">漫畫</option>
              <option value="movie">電影</option>
              <option value="book">書籍</option>
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="輸入關鍵字搜尋..."
              className="flex-1 p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
            />
            <button type="submit" disabled={loading} className="pixel-button pixel-button-primary disabled:opacity-50">
              {loading ? '...' : '搜尋'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mx-4 mb-2 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 text-red-700 dark:text-red-300 px-4 py-2 rounded-pixel-sm text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 pt-0 space-y-3">
          {results.map((result) => (
            <div
              key={`${result.type}-${result.external_id}`}
              className="flex gap-3 p-3 bg-bg-light dark:bg-bg-dark rounded-pixel-sm border border-text-muted-light dark:border-text-muted-dark"
            >
              {result.thumbnail && (
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-16 h-20 object-cover rounded-pixel-sm flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-light dark:text-text-dark text-sm truncate">{result.title}</h3>
                {result.original_title && (
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">{result.original_title}</p>
                )}
                <div className="flex gap-2 text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                  {result.author && <span>{result.author}</span>}
                  {result.year && <span>{result.year}</span>}
                  {result.score && <span>&#9733; {result.score}</span>}
                </div>
                {result.description && (
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 line-clamp-2">{result.description}</p>
                )}
              </div>
              <button
                onClick={() => onAdd(result)}
                className="pixel-button pixel-button-primary text-xs self-center flex-shrink-0"
              >
                加入
              </button>
            </div>
          ))}
          {results.length === 0 && !loading && query && (
            <p className="text-center text-text-muted-light dark:text-text-muted-dark py-4">沒有找到結果</p>
          )}
        </div>
      </div>
    </div>
  );
};
