import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from 'idb-keyval';
import { api } from '../../lib/api';
import { isAuthenticated } from '../../lib/auth';
import type {
  Manga,
  CreateMangaInput,
  UpdateMangaInput,
  MangaFilterOptions,
  MangaSortOption,
  MangaStorageData
} from './types';

const STORAGE_KEY = 'pocketit_manga_v1';
const TAG_STORAGE_KEY = 'pocketit_tags_history_v1';
const STORAGE_VERSION = '1.0.0';

// API response type (snake_case from backend)
interface ApiCollection {
  id: string;
  type: string;
  title: string;
  author: string | null;
  external_id: string | null;
  thumbnail_url: string | null;
  status: string;
  total_chapters: number | null;
  read_chapters: number;
  rating: number | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

function apiToManga(c: ApiCollection): Manga {
  const statusMap: Record<string, string> = {
    'want': 'want-to-read',
    'reading': 'reading',
    'completed': 'completed',
    'on-hold': 'on-hold',
    'dropped': 'dropped',
  };
  return {
    id: c.id,
    title: c.title,
    author: c.author ?? undefined,
    status: (statusMap[c.status] || c.status) as Manga['status'],
    totalChapters: c.total_chapters ?? undefined,
    readChapters: c.read_chapters,
    rating: c.rating ?? undefined,
    tags: c.tags ?? [],
    notes: c.notes ?? undefined,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

function mangaStatusToApi(status: string): string {
  const map: Record<string, string> = {
    'want-to-read': 'want',
    'reading': 'reading',
    'completed': 'completed',
    'on-hold': 'on-hold',
    'dropped': 'dropped',
  };
  return map[status] || status;
}

/**
 * 漫畫收藏狀態管理 Hook
 * 支援兩種模式: API 模式 (已登入) 和離線模式 (IndexedDB)
 */
export function useMangaStore() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [tagHistory, setTagHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const useApiMode = isAuthenticated();

  // ── 離線模式 helpers ──

  const saveTagsToDB = useCallback(async (tags: string[]) => {
    try { await set(TAG_STORAGE_KEY, tags); } catch (e) { console.error('Failed to save tags:', e); }
  }, []);

  const saveMangasToDB = useCallback(async (mangaList: Manga[]) => {
    try {
      const data: MangaStorageData = { version: STORAGE_VERSION, mangas: mangaList };
      await set(STORAGE_KEY, data);
    } catch (e) { console.error('Failed to save manga data:', e); }
  }, []);

  const addTagToHistory = useCallback((newTags: string[]) => {
    setTagHistory(prev => {
      const normalized = newTags.map(t => t.trim()).filter(t => t.length > 0);
      if (normalized.length === 0) return prev;
      const combined = new Set([...prev, ...normalized]);
      const updated = Array.from(combined).sort();
      if (updated.length !== prev.length) {
        saveTagsToDB(updated);
        return updated;
      }
      return prev;
    });
  }, [saveTagsToDB]);

  // ── 初始載入 ──

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        if (useApiMode) {
          const data = await api.get<ApiCollection[]>('/api/collections?type=manga');
          setMangas(data.map(apiToManga));
          const allTags = new Set<string>();
          data.forEach(c => { (c.tags ?? []).forEach(t => allTags.add(t)); });
          setTagHistory(Array.from(allTags).sort());
        } else {
          // 離線模式 (IndexedDB + localStorage migration)
          let loadedMangas: Manga[] = [];
          const dbMangas = await get<MangaStorageData>(STORAGE_KEY);
          if (dbMangas) {
            loadedMangas = dbMangas.mangas || [];
          } else {
            const localMangas = localStorage.getItem(STORAGE_KEY);
            if (localMangas) {
              const data: MangaStorageData = JSON.parse(localMangas);
              loadedMangas = data.mangas || [];
              await set(STORAGE_KEY, data);
              localStorage.removeItem(STORAGE_KEY);
            }
          }
          setMangas(loadedMangas);

          let loadedTags: string[] = [];
          const dbTags = await get<string[]>(TAG_STORAGE_KEY);
          if (dbTags) {
            loadedTags = dbTags;
          } else {
            const localTags = localStorage.getItem(TAG_STORAGE_KEY);
            if (localTags) {
              loadedTags = JSON.parse(localTags);
              await set(TAG_STORAGE_KEY, loadedTags);
              localStorage.removeItem(TAG_STORAGE_KEY);
            }
          }
          const allMangaTags = new Set<string>(loadedTags);
          loadedMangas.forEach(m => { m.tags?.forEach(t => allMangaTags.add(t)); });
          const finalTags = Array.from(allMangaTags).sort();
          if (finalTags.length > loadedTags.length) {
            await set(TAG_STORAGE_KEY, finalTags);
          }
          setTagHistory(finalTags);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [useApiMode]);

  // ── CRUD ──

  const addManga = useCallback(async (input: CreateMangaInput): Promise<Manga> => {
    if (input.tags && input.tags.length > 0) addTagToHistory(input.tags);

    if (useApiMode) {
      const body = {
        type: 'manga',
        title: input.title,
        author: input.author,
        status: mangaStatusToApi(input.status),
        total_chapters: input.totalChapters,
        read_chapters: input.readChapters ?? 0,
        rating: input.rating,
        tags: input.tags ?? [],
        notes: input.notes,
      };
      const data = await api.post<ApiCollection>('/api/collections', body);
      const manga = apiToManga(data);
      setMangas(prev => [...prev, manga]);
      return manga;
    } else {
      const now = new Date().toISOString();
      const newManga: Manga = {
        id: uuidv4(),
        title: input.title,
        author: input.author,
        status: input.status,
        totalChapters: input.totalChapters,
        readChapters: input.readChapters ?? 0,
        rating: input.rating,
        tags: input.tags ?? [],
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };
      setMangas(prev => {
        const updated = [...prev, newManga];
        saveMangasToDB(updated);
        return updated;
      });
      return newManga;
    }
  }, [useApiMode, saveMangasToDB, addTagToHistory]);

  const updateManga = useCallback(async (id: string, input: UpdateMangaInput): Promise<Manga | null> => {
    if (input.tags && input.tags.length > 0) addTagToHistory(input.tags);

    if (useApiMode) {
      const body: Record<string, unknown> = {};
      if (input.title !== undefined) body.title = input.title;
      if (input.author !== undefined) body.author = input.author;
      if (input.status !== undefined) body.status = mangaStatusToApi(input.status);
      if (input.totalChapters !== undefined) body.total_chapters = input.totalChapters;
      if (input.readChapters !== undefined) body.read_chapters = input.readChapters;
      if (input.rating !== undefined) body.rating = input.rating;
      if (input.tags !== undefined) body.tags = input.tags;
      if (input.notes !== undefined) body.notes = input.notes;
      const data = await api.patch<ApiCollection>(`/api/collections/${id}`, body);
      const manga = apiToManga(data);
      setMangas(prev => prev.map(m => m.id === id ? manga : m));
      return manga;
    } else {
      let updatedManga: Manga | null = null;
      setMangas(prev => {
        const index = prev.findIndex(m => m.id === id);
        if (index === -1) return prev;
        const manga = prev[index];
        const now = new Date().toISOString();
        let autoStatus = input.status;
        if (
          input.readChapters !== undefined &&
          manga.totalChapters !== undefined &&
          input.readChapters >= manga.totalChapters &&
          manga.status !== 'completed'
        ) {
          autoStatus = 'completed';
        }
        updatedManga = { ...manga, ...input, status: autoStatus ?? manga.status, updatedAt: now };
        const updated = [...prev];
        updated[index] = updatedManga;
        saveMangasToDB(updated);
        return updated;
      });
      return updatedManga;
    }
  }, [useApiMode, saveMangasToDB, addTagToHistory]);

  const deleteManga = useCallback(async (id: string): Promise<boolean> => {
    if (useApiMode) {
      await api.delete(`/api/collections/${id}`);
      setMangas(prev => prev.filter(m => m.id !== id));
      return true;
    } else {
      let deleted = false;
      setMangas(prev => {
        const filtered = prev.filter(m => m.id !== id);
        deleted = filtered.length !== prev.length;
        if (deleted) saveMangasToDB(filtered);
        return filtered;
      });
      return deleted;
    }
  }, [useApiMode, saveMangasToDB]);

  // ── 搜尋與篩選 (純前端) ──

  const getMangaById = useCallback((id: string): Manga | undefined => {
    return mangas.find(m => m.id === id);
  }, [mangas]);

  const searchMangas = useCallback((query: string): Manga[] => {
    if (!query.trim()) return mangas;
    const lowerQuery = query.toLowerCase();
    return mangas.filter(manga =>
      manga.title.toLowerCase().includes(lowerQuery) ||
      (manga.author?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }, [mangas]);

  const filterMangas = useCallback((options: MangaFilterOptions): Manga[] => {
    let filtered = mangas;
    if (options.searchQuery) {
      const lowerQuery = options.searchQuery.toLowerCase();
      filtered = filtered.filter(manga =>
        manga.title.toLowerCase().includes(lowerQuery) ||
        (manga.author?.toLowerCase().includes(lowerQuery) ?? false)
      );
    }
    if (options.status) {
      filtered = filtered.filter(manga => manga.status === options.status);
    }
    if (options.minRating !== undefined) {
      filtered = filtered.filter(manga => manga.rating !== undefined && manga.rating >= options.minRating!);
    }
    if (options.maxRating !== undefined) {
      filtered = filtered.filter(manga => manga.rating !== undefined && manga.rating <= options.maxRating!);
    }
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(manga => options.tags!.some(tag => manga.tags.includes(tag)));
    }
    return filtered;
  }, [mangas]);

  const sortMangas = useCallback((mangaList: Manga[], sortBy: MangaSortOption): Manga[] => {
    const sorted = [...mangaList];
    switch (sortBy) {
      case 'createdAt-desc': return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'createdAt-asc': return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case 'updatedAt-desc': return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      case 'updatedAt-asc': return sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
      case 'title-asc': return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc': return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc': return sorted.sort((a, b) => {
        if (a.rating === undefined && b.rating === undefined) return 0;
        if (a.rating === undefined) return 1;
        if (b.rating === undefined) return -1;
        return b.rating - a.rating;
      });
      case 'rating-asc': return sorted.sort((a, b) => {
        if (a.rating === undefined && b.rating === undefined) return 0;
        if (a.rating === undefined) return 1;
        if (b.rating === undefined) return -1;
        return a.rating - b.rating;
      });
      default: return sorted;
    }
  }, []);

  const getAllTags = useCallback((): string[] => tagHistory, [tagHistory]);

  const getStats = useCallback(() => {
    const total = mangas.length;
    const byStatus = {
      'want-to-read': mangas.filter(m => m.status === 'want-to-read').length,
      'reading': mangas.filter(m => m.status === 'reading').length,
      'completed': mangas.filter(m => m.status === 'completed').length,
      'on-hold': mangas.filter(m => m.status === 'on-hold').length,
      'dropped': mangas.filter(m => m.status === 'dropped').length,
    };
    const totalChaptersRead = mangas.reduce((sum, m) => sum + m.readChapters, 0);
    const rated = mangas.filter(m => m.rating !== undefined);
    const avgRating = rated.length > 0
      ? Math.round(rated.reduce((sum, m) => sum + (m.rating ?? 0), 0) / rated.length * 10) / 10
      : 0;
    return { total, byStatus, totalChaptersRead, avgRating };
  }, [mangas]);

  return {
    mangas,
    isLoading,
    tagHistory,
    addManga,
    updateManga,
    deleteManga,
    getMangaById,
    addTagToHistory,
    searchMangas,
    filterMangas,
    sortMangas,
    getAllTags,
    getStats,
  };
}
