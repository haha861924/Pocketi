import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMovieStore } from './useMovieStore';
import type { CreateMovieInput } from './types';

// Mock idb-keyval
const mockStore: Record<string, unknown> = {};
vi.mock('idb-keyval', () => ({
  get: vi.fn((key: string) => Promise.resolve(mockStore[key] ?? undefined)),
  set: vi.fn((key: string, value: unknown) => {
    mockStore[key] = value;
    return Promise.resolve();
  }),
}));

// Mock auth — 離線模式
vi.mock('../../lib/auth', () => ({
  isAuthenticated: () => false,
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: () => 'movie-uuid-1234',
}));

describe('useMovieStore', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
    vi.clearAllMocks();
  });

  it('初始狀態為空陣列，載入完成後 isLoading 為 false', async () => {
    const { result } = renderHook(() => useMovieStore());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(0);
  });

  it('應該從 IndexedDB 載入資料', async () => {
    mockStore['pocketit_movie_v1'] = {
      version: '1.0.0',
      movies: [
        { id: '1', title: 'Inception', director: 'Nolan', status: 'completed', rating: 9, tags: ['sci-fi'], createdAt: '2026-01-01', updatedAt: '2026-01-01' }
      ],
    };

    const { result } = renderHook(() => useMovieStore());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe('Inception');
    expect(result.current.tagHistory).toContain('sci-fi');
  });

  it('應該成功新增電影', async () => {
    const { result } = renderHook(() => useMovieStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const input: CreateMovieInput = {
      title: 'Interstellar',
      director: 'Christopher Nolan',
      status: 'want-to-watch',
      rating: 10,
      tags: ['sci-fi', 'drama'],
    };

    await act(async () => {
      await result.current.addMovie(input);
    });

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe('Interstellar');
    expect(result.current.movies[0].director).toBe('Christopher Nolan');
    expect(result.current.movies[0].id).toBe('movie-uuid-1234');
  });

  it('應該成功更新電影', async () => {
    const { result } = renderHook(() => useMovieStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addMovie({ title: 'Old Title', status: 'want-to-watch' });
    });

    await act(async () => {
      await result.current.updateMovie('movie-uuid-1234', { title: 'New Title', rating: 8 });
    });

    expect(result.current.movies[0].title).toBe('New Title');
    expect(result.current.movies[0].rating).toBe(8);
  });

  it('應該成功刪除電影', async () => {
    const { result } = renderHook(() => useMovieStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addMovie({ title: 'Delete Me', status: 'dropped' });
    });

    expect(result.current.movies).toHaveLength(1);

    await act(async () => {
      await result.current.deleteMovie('movie-uuid-1234');
    });

    expect(result.current.movies).toHaveLength(0);
  });

  it('應該正確篩選電影', async () => {
    const { result } = renderHook(() => useMovieStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 空結果測試
    expect(result.current.filterMovies({ searchQuery: 'nonexistent' })).toEqual([]);
    expect(result.current.filterMovies({ status: 'completed' })).toEqual([]);
    expect(result.current.filterMovies({})).toEqual([]);
  });

  it('應該正確排序電影', () => {
    const { result } = renderHook(() => useMovieStore());

    const movies = [
      { id: '1', title: 'Zebra', status: 'completed' as const, tags: [], rating: 6, createdAt: '2026-01-02', updatedAt: '2026-01-02' },
      { id: '2', title: 'Alpha', status: 'completed' as const, tags: [], rating: 9, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
    ];

    const byTitle = result.current.sortMovies(movies, 'title-asc');
    expect(byTitle[0].title).toBe('Alpha');

    const byRating = result.current.sortMovies(movies, 'rating-desc');
    expect(byRating[0].rating).toBe(9);

    const byDate = result.current.sortMovies(movies, 'createdAt-desc');
    expect(byDate[0].title).toBe('Zebra');
  });
});
