import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMangaStore } from './useMangaStore';
import { MangaCard } from './MangaCard';
import { MangaForm } from './MangaForm';
import { MangaDetail } from './MangaDetail';
import { SearchPanel } from '../search/SearchPanel';
import { isAuthenticated } from '../../lib/auth';
import { logout } from '../../lib/auth';
import { api } from '../../lib/api';
import type {
  Manga,
  MangaFilterOptions,
  MangaSortOption
} from './types';
import {
  MANGA_STATUS_MAP,
  MANGA_SORT_OPTIONS
} from './types';

export const MangaList: React.FC = () => {
  const navigate = useNavigate();
  const {
    mangas,
    isLoading,
    deleteManga,
    addManga,
    updateManga,
    filterMangas,
    sortMangas
  } = useMangaStore();

  const loggedIn = isAuthenticated();

  // 狀態管理
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManga, setEditingManga] = useState<Manga | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<MangaSortOption>('updatedAt-desc');

  const [viewingManga, setViewingManga] = useState<Manga | undefined>(undefined);

  // 處理新增
  const handleCreate = () => {
    setEditingManga(undefined);
    setIsFormOpen(true);
  };

  // 處理編輯
  const handleEdit = (manga: Manga) => {
    setViewingManga(undefined); // 關閉詳情
    setEditingManga(manga);
    setIsFormOpen(true);
  };

  // 處理刪除
  const handleDelete = (manga: Manga) => {
    if (window.confirm(`確定要刪除「${manga.title}」嗎?將無法復原。`)) {
      deleteManga(manga.id);
      if (viewingManga?.id === manga.id) {
        setViewingManga(undefined);
      }
    }
  };

  // 處理表單提交
  const handleFormSubmit = (data: any) => {
    if (editingManga) {
      updateManga(editingManga.id, data);
    } else {
      addManga(data);
    }
  };

  // 處理從搜尋結果加入收藏
  const handleSearchAdd = async (result: any) => {
    if (loggedIn) {
      await api.post('/api/collections', {
        type: result.type,
        title: result.title,
        author: result.author,
        external_id: result.external_id,
        thumbnail_url: result.thumbnail,
        status: 'want',
        tags: [],
      });
      // 重新載入 (簡單方式: 重新整理頁面)
      window.location.reload();
    } else {
      addManga({
        title: result.title,
        author: result.author,
        status: 'want-to-read',
        tags: [],
      });
    }
    setIsSearchOpen(false);
  };

  // 處理卡片點擊
  const handleCardClick = (manga: Manga) => {
    setViewingManga(manga);
  };

  // 計算經過篩選和排序的漫畫列表
  const displayedMangas = useMemo(() => {
    const filterOptions: MangaFilterOptions = {
      searchQuery,
      status: selectedStatus ? (selectedStatus as any) : undefined
    };

    const filtered = filterMangas(filterOptions);
    return sortMangas(filtered, sortBy);
  }, [mangas, searchQuery, selectedStatus, sortBy, filterMangas, sortMangas]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse font-pixel text-xl text-pixel-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      {/* 標題區塊 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-pixel-primary mb-2 flex items-center gap-1 transition-colors"
          >
            ← 返回首頁
          </button>
          <h1 className="text-3xl font-pixel text-text-light dark:text-text-dark mb-2">漫畫收藏</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            共 {mangas.length} 本漫畫 • {displayedMangas.length} 個結果
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {loggedIn && (
            <>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="pixel-button pixel-button-primary"
              >
                搜尋新增
              </button>
              <button
                onClick={logout}
                className="pixel-button text-sm"
              >
                登出
              </button>
            </>
          )}
          {!loggedIn && (
            <button
              onClick={() => navigate('/login')}
              className="pixel-button text-sm"
            >
              登入
            </button>
          )}
          <button
            onClick={handleCreate}
            className="pixel-button pixel-button-primary"
          >
            + 新增漫畫
          </button>
        </div>
      </div>

      {/* 篩選工具列 */}
      <div className="bg-bg-card-light dark:bg-bg-card-dark p-4 rounded-pixel-md border-2 border-text-light dark:border-text-dark mb-8 shadow-pixel">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* 搜尋 */}
          <div className="md:col-span-5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋標題或作者..."
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
            />
          </div>

          {/* 狀態篩選 */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
            >
              <option value="">所有狀態</option>
              {Object.entries(MANGA_STATUS_MAP).map(([key, info]) => (
                <option key={key} value={key}>{info.label}</option>
              ))}
            </select>
          </div>

          {/* 排序 */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MangaSortOption)}
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
            >
              {MANGA_SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 漫畫列表 */}
      {displayedMangas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedMangas.map(manga => (
            <MangaCard
              key={manga.id}
              manga={manga}
              onClick={handleCardClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-bg-card-light dark:bg-bg-card-dark rounded-pixel-md border-2 border-dashed border-text-muted-light dark:border-text-muted-dark">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2 text-text-light dark:text-text-dark">找不到漫畫</h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {searchQuery || selectedStatus
              ? '嘗試調整搜尋條件或篩選器'
              : '開始新增你的第一本漫畫收藏吧!'}
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

      {/* 表單 Modal */}
      <MangaForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingManga}
        isEditMode={!!editingManga}
      />

      {/* 詳情 Modal */}
      <MangaDetail
        manga={viewingManga}
        isOpen={!!viewingManga}
        onClose={() => setViewingManga(undefined)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 搜尋面板 */}
      <SearchPanel
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAdd={handleSearchAdd}
        defaultType="manga"
      />
    </div>
  );
};
