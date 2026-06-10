import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { get, set } from 'idb-keyval';
import { api } from '../../lib/api';
import { isAuthenticated } from '../../lib/auth';
import type {
  Movie,
  CreateMovieInput,
  UpdateMovieInput,
  MovieFilterOptions,
  MovieSortOption
} from './types';

const STORAGE_KEY = 'pocketit_movie_v1';
const STORAGE_VERSION = '1.0.0';

interface MovieStorageData {
  version: string;
  movies: Movie[];
}

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

function apiToMovie(c: ApiCollection): Movie {
  const statusMap: Record<string, string> = {
    'want': 'want-to-watch',
    'watching': 'watching',
    'completed': 'completed',
    'on-hold': 'on-hold',
    'dropped': 'dropped',
  };
  return {
    id: c.id,
    title: c.title,
    director: c.author ?? undefined,
    status: (statusMap[c.status] || c.status) as Movie['status'],
    rating: c.rating ?? undefined,
    tags: c.tags ?? [],
    notes: c.notes ?? undefined,
    thumbnailUrl: c.thumbnail_url ?? undefined,
    externalId: c.external_id ?? undefined,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

function movieStatusToApi(status: string): string {
  const map: Record<string, string> = {
    'want-to-watch': 'want',
    'watching': 'watching',
    'completed': 'completed',
    'on-hold': 'on-hold',
    'dropped': 'dropped',
  };
  return map[status] || status;
}

export function useMovieStore() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tagHistory, setTagHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const useApiMode = isAuthenticated();

  const saveMoviesToDB = useCallback(async (list: Movie[]) => {
    try {
      await set(STORAGE_KEY, { version: STORAGE_VERSION, movies: list } as MovieStorageData);
    } catch (e) { console.error('Failed to save movie data:', e); }
  }, []);

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (useApiMode) {
          const data = await api.get<ApiCollection[]>('/api/collections?type=movie');
          setMovies(data.map(apiToMovie));
          const allTags = new Set<string>();
          data.forEach(c => { (c.tags ?? []).forEach(t => allTags.add(t)); });
          setTagHistory(Array.from(allTags).sort());
        } else {
          const dbData = await get<MovieStorageData>(STORAGE_KEY);
          const loaded = dbData?.movies ?? [];
          setMovies(loaded);
          const allTags = new Set<string>();
          loaded.forEach(m => m.tags?.forEach(t => allTags.add(t)));
          setTagHistory(Array.from(allTags).sort());
        }
      } catch (error) {
        console.error('Failed to load movie data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [useApiMode]);

  const addMovie = useCallback(async (input: CreateMovieInput): Promise<Movie> => {
    if (useApiMode) {
      const body = {
        type: 'movie',
        title: input.title,
        author: input.director,
        status: movieStatusToApi(input.status),
        rating: input.rating,
        tags: input.tags ?? [],
        notes: input.notes,
        external_id: input.externalId,
        thumbnail_url: input.thumbnailUrl,
      };
      const data = await api.post<ApiCollection>('/api/collections', body);
      const movie = apiToMovie(data);
      setMovies(prev => [...prev, movie]);
      return movie;
    } else {
      const now = new Date().toISOString();
      const newMovie: Movie = {
        id: uuidv4(),
        title: input.title,
        director: input.director,
        status: input.status,
        rating: input.rating,
        tags: input.tags ?? [],
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };
      setMovies(prev => {
        const updated = [...prev, newMovie];
        saveMoviesToDB(updated);
        return updated;
      });
      return newMovie;
    }
  }, [useApiMode, saveMoviesToDB]);

  const updateMovie = useCallback(async (id: string, input: UpdateMovieInput): Promise<Movie | null> => {
    if (useApiMode) {
      const body: Record<string, unknown> = {};
      if (input.title !== undefined) body.title = input.title;
      if (input.director !== undefined) body.author = input.director;
      if (input.status !== undefined) body.status = movieStatusToApi(input.status);
      if (input.rating !== undefined) body.rating = input.rating;
      if (input.tags !== undefined) body.tags = input.tags;
      if (input.notes !== undefined) body.notes = input.notes;
      const data = await api.patch<ApiCollection>(`/api/collections/${id}`, body);
      const movie = apiToMovie(data);
      setMovies(prev => prev.map(m => m.id === id ? movie : m));
      return movie;
    } else {
      let updatedMovie: Movie | null = null;
      setMovies(prev => {
        const index = prev.findIndex(m => m.id === id);
        if (index === -1) return prev;
        updatedMovie = { ...prev[index], ...input, updatedAt: new Date().toISOString() };
        const updated = [...prev];
        updated[index] = updatedMovie!;
        saveMoviesToDB(updated);
        return updated;
      });
      return updatedMovie;
    }
  }, [useApiMode, saveMoviesToDB]);

  const deleteMovie = useCallback(async (id: string): Promise<boolean> => {
    if (useApiMode) {
      await api.delete(`/api/collections/${id}`);
      setMovies(prev => prev.filter(m => m.id !== id));
      return true;
    } else {
      let deleted = false;
      setMovies(prev => {
        const filtered = prev.filter(m => m.id !== id);
        deleted = filtered.length !== prev.length;
        if (deleted) saveMoviesToDB(filtered);
        return filtered;
      });
      return deleted;
    }
  }, [useApiMode, saveMoviesToDB]);

  const filterMovies = useCallback((options: MovieFilterOptions): Movie[] => {
    let filtered = movies;
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.director?.toLowerCase().includes(q) ?? false)
      );
    }
    if (options.status) {
      filtered = filtered.filter(m => m.status === options.status);
    }
    if (options.minRating !== undefined) {
      filtered = filtered.filter(m => m.rating !== undefined && m.rating >= options.minRating!);
    }
    if (options.maxRating !== undefined) {
      filtered = filtered.filter(m => m.rating !== undefined && m.rating <= options.maxRating!);
    }
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(m => options.tags!.some(tag => m.tags.includes(tag)));
    }
    return filtered;
  }, [movies]);

  const sortMovies = useCallback((list: Movie[], sortBy: MovieSortOption): Movie[] => {
    const sorted = [...list];
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

  return {
    movies,
    isLoading,
    tagHistory,
    addMovie,
    updateMovie,
    deleteMovie,
    filterMovies,
    sortMovies,
    getAllTags,
  };
}
