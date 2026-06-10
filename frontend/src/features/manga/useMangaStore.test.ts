import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMangaStore } from './useMangaStore';
import type { CreateMangaInput } from './types';

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
  v4: () => 'test-uuid-1234',
}));

describe('useMangaStore', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('初始狀態為空陣列，載入完成後 isLoading 為 false', async () => {
    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.mangas).toHaveLength(0);
  });

  it('應該從 IndexedDB 載入資料', async () => {
    mockStore['pocketit_manga_v1'] = {
      version: '1.0.0',
      mangas: [
        { id: '1', title: 'Test Manga', status: 'reading', readChapters: 5, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' }
      ],
    };

    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.mangas).toHaveLength(1);
    expect(result.current.mangas[0].title).toBe('Test Manga');
  });

  it('應該從 localStorage 遷移資料到 IndexedDB', async () => {
    const mockData = {
      version: '1.0.0',
      mangas: [
        { id: '1', title: 'Migrated Manga', status: 'want-to-read', readChapters: 0, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' }
      ],
    };
    localStorage.setItem('pocketit_manga_v1', JSON.stringify(mockData));

    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.mangas).toHaveLength(1);
    expect(result.current.mangas[0].title).toBe('Migrated Manga');
    // localStorage 應被清除
    expect(localStorage.getItem('pocketit_manga_v1')).toBeNull();
  });

  it('應該成功新增漫畫', async () => {
    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const input: CreateMangaInput = {
      title: 'New Manga',
      status: 'want-to-read',
      readChapters: 0,
      tags: ['action'],
    };

    await act(async () => {
      await result.current.addManga(input);
    });

    expect(result.current.mangas).toHaveLength(1);
    expect(result.current.mangas[0].title).toBe('New Manga');
    expect(result.current.mangas[0].id).toBe('test-uuid-1234');
    expect(result.current.mangas[0].tags).toEqual(['action']);
  });

  it('應該成功更新漫畫', async () => {
    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addManga({ title: 'Old Title', status: 'want-to-read', readChapters: 0 });
    });

    await act(async () => {
      await result.current.updateManga('test-uuid-1234', { title: 'New Title', readChapters: 5 });
    });

    expect(result.current.mangas[0].title).toBe('New Title');
    expect(result.current.mangas[0].readChapters).toBe(5);
  });

  it('應該在進度達到 100% 時自動更新狀態為已完成', async () => {
    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addManga({ title: 'Test', status: 'reading', totalChapters: 10, readChapters: 5 });
    });

    await act(async () => {
      await result.current.updateManga('test-uuid-1234', { readChapters: 10 });
    });

    expect(result.current.mangas[0].status).toBe('completed');
  });

  it('應該成功刪除漫畫', async () => {
    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addManga({ title: 'Delete Me', status: 'dropped', readChapters: 0 });
    });

    expect(result.current.mangas).toHaveLength(1);

    await act(async () => {
      await result.current.deleteManga('test-uuid-1234');
    });

    expect(result.current.mangas).toHaveLength(0);
  });

  it('應該正確篩選漫畫', async () => {
    const { result } = renderHook(() => useMangaStore());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.filterMangas({ searchQuery: 'test' })).toEqual([]);
    expect(result.current.filterMangas({ status: 'reading' })).toEqual([]);
    expect(result.current.filterMangas({})).toEqual([]);
  });

  it('應該正確排序漫畫', () => {
    const { result } = renderHook(() => useMangaStore());

    const mangas = [
      { id: '1', title: 'B Manga', status: 'reading' as const, readChapters: 0, tags: [], rating: 8, createdAt: '2026-01-02', updatedAt: '2026-01-02' },
      { id: '2', title: 'A Manga', status: 'reading' as const, readChapters: 0, tags: [], rating: 5, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
    ];

    const byTitle = result.current.sortMangas(mangas, 'title-asc');
    expect(byTitle[0].title).toBe('A Manga');

    const byRating = result.current.sortMangas(mangas, 'rating-desc');
    expect(byRating[0].rating).toBe(8);
  });
});
