import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from 'idb-keyval';
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

/**
 * 漫畫收藏狀態管理 Hook
 */
export function useMangaStore() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [tagHistory, setTagHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 儲存標籤歷史到 IndexedDB
  const saveTagsToDB = useCallback(async (tags: string[]) => {
    try {
      await set(TAG_STORAGE_KEY, tags);
    } catch (error) {
      console.error('Failed to save tags to IndexedDB:', error);
    }
  }, []);

  // 儲存漫畫資料到 IndexedDB
  const saveMangasToDB = useCallback(async (mangaList: Manga[]) => {
    try {
      const data: MangaStorageData = {
        version: STORAGE_VERSION,
        mangas: mangaList
      };
      await set(STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save manga data to IndexedDB:', error);
    }
  }, []);

  // 新增標籤至歷史 (Helper)
  const addTagToHistory = useCallback((newTags: string[]) => {
    setTagHistory(prev => {
      // 1. 正規化新標籤 (去除空白)
      const normalizedNewTags = newTags
        .map(t => t.trim())
        .filter(t => t.length > 0);

      if (normalizedNewTags.length === 0) return prev;

      // 2. 合併並去重
      const combined = new Set([...prev, ...normalizedNewTags]);
      const updated = Array.from(combined).sort();

      // 3. 只有在真的有改變時才儲存
      if (updated.length !== prev.length) {
        saveTagsToDB(updated);
        return updated;
      }
      return prev;
    });
  }, [saveTagsToDB]);

  // 初始載入與遷移邏輯
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // --- 1. 載入漫畫資料 (Migration Check) ---
        let loadedMangas: Manga[] = [];
        const dbMangas = await get<MangaStorageData>(STORAGE_KEY);

        if (dbMangas) {
          // IndexedDB 有資料，直接使用
          loadedMangas = dbMangas.mangas || [];
        } else {
          // IndexedDB 無資料，檢查 LocalStorage (遷移)
          const localMangas = localStorage.getItem(STORAGE_KEY);
          if (localMangas) {
            console.log('Migrating manga data from LocalStorage to IndexedDB...');
            const data: MangaStorageData = JSON.parse(localMangas);
            loadedMangas = data.mangas || [];

            // 寫入 DB 並清除 LocalStorage
            await set(STORAGE_KEY, data);
            localStorage.removeItem(STORAGE_KEY);
          }
        }
        setMangas(loadedMangas);

        // --- 2. 載入標籤歷史 (Migration Check) ---
        let loadedTags: string[] = [];
        const dbTags = await get<string[]>(TAG_STORAGE_KEY);

        if (dbTags) {
          loadedTags = dbTags;
        } else {
          // Check LocalStorage
          const localTags = localStorage.getItem(TAG_STORAGE_KEY);
          if (localTags) {
            console.log('Migrating tags from LocalStorage to IndexedDB...');
            loadedTags = JSON.parse(localTags);
            // Write DB & Clear Local
            await set(TAG_STORAGE_KEY, loadedTags);
            localStorage.removeItem(TAG_STORAGE_KEY);
          }
        }

        // --- 3. 確保標籤完整性 (Sync Logic) ---
        // 從所有漫畫中收集標籤，確保它們都在歷史記錄中
        const allMangaTags = new Set<string>(loadedTags);
        loadedMangas.forEach(m => {
          if (m.tags) {
            m.tags.forEach(t => allMangaTags.add(t));
          }
        });

        const finalTags = Array.from(allMangaTags).sort();

        // 如果合併後比載入的多，或是剛遷移完，都再存一次確保一致
        if (finalTags.length > loadedTags.length) {
          await set(TAG_STORAGE_KEY, finalTags);
        }

        setTagHistory(finalTags);

      } catch (error) {
        console.error('Failed to load data:', error);
        // Error handling: maybe toast? for now just console.
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Run once on mount

  // 新增漫畫
  const addManga = useCallback((input: CreateMangaInput): Manga => {
    const now = new Date().toISOString();

    // 自動收集標籤
    if (input.tags && input.tags.length > 0) {
      addTagToHistory(input.tags);
    }

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
      updatedAt: now
    };

    setMangas(prev => {
      const updated = [...prev, newManga];
      saveMangasToDB(updated);
      return updated;
    });

    return newManga;
  }, [saveMangasToDB, addTagToHistory]);

  // 更新漫畫
  const updateManga = useCallback((id: string, input: UpdateMangaInput): Manga | null => {
    let updatedManga: Manga | null = null;

    // 自動收集標籤
    if (input.tags && input.tags.length > 0) {
      addTagToHistory(input.tags);
    }

    setMangas(prev => {
      const index = prev.findIndex(m => m.id === id);
      if (index === -1) return prev;

      const manga = prev[index];
      const now = new Date().toISOString();

      // 檢查是否需要自動更新狀態為已完成
      let autoStatus = input.status;
      if (
        input.readChapters !== undefined &&
        manga.totalChapters !== undefined &&
        input.readChapters >= manga.totalChapters &&
        manga.status !== 'completed'
      ) {
        autoStatus = 'completed';
      }

      updatedManga = {
        ...manga,
        ...input,
        status: autoStatus ?? manga.status,
        updatedAt: now
      };

      const updated = [...prev];
      updated[index] = updatedManga;
      saveMangasToDB(updated);
      return updated;
    });

    return updatedManga;
  }, [saveMangasToDB, addTagToHistory]);

  // 刪除漫畫
  const deleteManga = useCallback((id: string): boolean => {
    let deleted = false;

    setMangas(prev => {
      const filtered = prev.filter(m => m.id !== id);
      deleted = filtered.length !== prev.length;
      if (deleted) {
        saveMangasToDB(filtered);
      }
      return filtered;
    });

    return deleted;
  }, [saveMangasToDB]);

  // 依 ID 取得漫畫
  const getMangaById = useCallback((id: string): Manga | undefined => {
    return mangas.find(m => m.id === id);
  }, [mangas]);

  // 搜尋漫畫
  const searchMangas = useCallback((query: string): Manga[] => {
    if (!query.trim()) return mangas;

    const lowerQuery = query.toLowerCase();
    return mangas.filter(manga =>
      manga.title.toLowerCase().includes(lowerQuery) ||
      (manga.author?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }, [mangas]);

  // 篩選漫畫
  const filterMangas = useCallback((options: MangaFilterOptions): Manga[] => {
    let filtered = mangas;

    // 關鍵字搜尋
    if (options.searchQuery) {
      const lowerQuery = options.searchQuery.toLowerCase();
      filtered = filtered.filter(manga =>
        manga.title.toLowerCase().includes(lowerQuery) ||
        (manga.author?.toLowerCase().includes(lowerQuery) ?? false)
      );
    }

    // 狀態篩選
    if (options.status) {
      filtered = filtered.filter(manga => manga.status === options.status);
    }

    // 評分範圍篩選
    if (options.minRating !== undefined) {
      filtered = filtered.filter(manga =>
        manga.rating !== undefined && manga.rating >= options.minRating!
      );
    }
    if (options.maxRating !== undefined) {
      filtered = filtered.filter(manga =>
        manga.rating !== undefined && manga.rating <= options.maxRating!
      );
    }

    // 標籤篩選
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(manga =>
        options.tags!.some(tag => manga.tags.includes(tag))
      );
    }

    return filtered;
  }, [mangas]);

  // 排序漫畫
  const sortMangas = useCallback((mangaList: Manga[], sortBy: MangaSortOption): Manga[] => {
    const sorted = [...mangaList];

    switch (sortBy) {
      case 'createdAt-desc':
        return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'createdAt-asc':
        return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case 'updatedAt-desc':
        return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      case 'updatedAt-asc':
        return sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc':
        return sorted.sort((a, b) => {
          if (a.rating === undefined && b.rating === undefined) return 0;
          if (a.rating === undefined) return 1;
          if (b.rating === undefined) return -1;
          return b.rating - a.rating;
        });
      case 'rating-asc':
        return sorted.sort((a, b) => {
          if (a.rating === undefined && b.rating === undefined) return 0;
          if (a.rating === undefined) return 1;
          if (b.rating === undefined) return -1;
          return a.rating - b.rating;
        });
      default:
        return sorted;
    }
  }, []);

  // 取得所有唯一標籤
  const getAllTags = useCallback((): string[] => {
    return tagHistory;
  }, [tagHistory]);

  // 取得統計資訊
  const getStats = useCallback(() => {
    const total = mangas.length;
    const byStatus = {
      'want-to-read': mangas.filter(m => m.status === 'want-to-read').length,
      'reading': mangas.filter(m => m.status === 'reading').length,
      'completed': mangas.filter(m => m.status === 'completed').length,
      'on-hold': mangas.filter(m => m.status === 'on-hold').length,
      'dropped': mangas.filter(m => m.status === 'dropped').length
    };

    const totalChaptersRead = mangas.reduce((sum, m) => sum + m.readChapters, 0);
    const avgRating = mangas.filter(m => m.rating !== undefined).length > 0
      ? mangas.reduce((sum, m) => sum + (m.rating ?? 0), 0) / mangas.filter(m => m.rating !== undefined).length
      : 0;

    return {
      total,
      byStatus,
      totalChaptersRead,
      avgRating: Math.round(avgRating * 10) / 10
    };
  }, [mangas]);

  return {
    // 狀態
    mangas,
    isLoading,
    tagHistory,

    // CRUD 操作
    addManga,
    updateManga,
    deleteManga,
    getMangaById,
    addTagToHistory,

    // 搜尋與篩選
    searchMangas,
    filterMangas,
    sortMangas,

    // 工具函數
    getAllTags,
    getStats
  };
}
