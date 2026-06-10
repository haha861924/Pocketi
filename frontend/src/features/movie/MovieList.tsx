import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieStore } from './useMovieStore';
import { MovieCard } from './MovieCard';
import { MovieForm } from './MovieForm';
import { MovieDetail } from './MovieDetail';
import { SearchPanel } from '../search/SearchPanel';
import { isAuthenticated, logout } from '../../lib/auth';
import { api } from '../../lib/api';
import type { Movie, MovieFilterOptions, MovieSortOption } from './types';
import { MOVIE_STATUS_MAP, MOVIE_SORT_OPTIONS } from './types';

export const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const { movies, isLoading, deleteMovie, addMovie, updateMovie, filterMovies, sortMovies } = useMovieStore();
  const loggedIn = isAuthenticated();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | undefined>(undefined);
  const [viewingMovie, setViewingMovie] = useState<Movie | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<MovieSortOption>('updatedAt-desc');

  const handleCreate = () => {
    setEditingMovie(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setViewingMovie(undefined);
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    if (window.confirm(`確定要刪除「${movie.title}」嗎?將無法復原。`)) {
      deleteMovie(movie.id);
      if (viewingMovie?.id === movie.id) setViewingMovie(undefined);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingMovie) {
      updateMovie(editingMovie.id, data);
    } else {
      addMovie(data);
    }
  };

  const handleSearchAdd = async (result: any) => {
    if (loggedIn) {
      await api.post('/api/collections', {
        type: 'movie',
        title: result.title,
        author: result.author,
        external_id: result.external_id,
        thumbnail_url: result.thumbnail,
        status: 'want',
        tags: [],
      });
      window.location.reload();
    } else {
      addMovie({
        title: result.title,
        director: result.author,
        status: 'want-to-watch',
        tags: [],
      });
    }
    setIsSearchOpen(false);
  };

  const displayedMovies = useMemo(() => {
    const options: MovieFilterOptions = {
      searchQuery,
      status: selectedStatus ? (selectedStatus as any) : undefined,
    };
    const filtered = filterMovies(options);
    return sortMovies(filtered, sortBy);
  }, [movies, searchQuery, selectedStatus, sortBy, filterMovies, sortMovies]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse font-pixel text-xl text-pixel-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* 標題 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-pixel-primary mb-2 flex items-center gap-1 transition-colors"
          >
            &larr; 返回首頁
          </button>
          <h1 className="text-3xl font-pixel text-text-light dark:text-text-dark mb-2">電影紀錄</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            共 {movies.length} 部電影 &bull; {displayedMovies.length} 個結果
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {loggedIn && (
            <>
              <button onClick={() => setIsSearchOpen(true)} className="pixel-button pixel-button-primary">
                搜尋新增
              </button>
              <button onClick={logout} className="pixel-button text-sm">登出</button>
            </>
          )}
          {!loggedIn && (
            <button onClick={() => navigate('/login')} className="pixel-button text-sm">登入</button>
          )}
          <button onClick={handleCreate} className="pixel-button pixel-button-primary">
            + 新增電影
          </button>
        </div>
      </div>

      {/* 篩選工具列 */}
      <div className="bg-bg-card-light dark:bg-bg-card-dark p-4 rounded-pixel-md border-2 border-text-light dark:border-text-dark mb-8 shadow-pixel">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋電影名稱或導演..."
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
            >
              <option value="">所有狀態</option>
              {Object.entries(MOVIE_STATUS_MAP).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MovieSortOption)}
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
            >
              {MOVIE_SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 電影列表 */}
      {displayedMovies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={setViewingMovie}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-bg-card-light dark:bg-bg-card-dark rounded-pixel-md border-2 border-dashed border-text-muted-light dark:border-text-muted-dark">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-xl font-bold mb-2 text-text-light dark:text-text-dark">找不到電影</h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {searchQuery || selectedStatus
              ? '嘗試調整搜尋條件或篩選器'
              : '開始新增你的第一部電影紀錄吧!'}
          </p>
          {(searchQuery || selectedStatus) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatus(''); }}
              className="text-pixel-primary hover:underline"
            >
              清除所有篩選
            </button>
          )}
        </div>
      )}

      <MovieForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingMovie} isEditMode={!!editingMovie} />
      <MovieDetail movie={viewingMovie} isOpen={!!viewingMovie} onClose={() => setViewingMovie(undefined)} onEdit={handleEdit} onDelete={handleDelete} />
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onAdd={handleSearchAdd} defaultType="movie" />
    </div>
  );
};
