import React, { useState, useEffect } from 'react';
import type { CreateMangaInput, UpdateMangaInput, Manga } from './types';
import { MANGA_STATUS_MAP } from './types';
import { useMangaStore } from './useMangaStore';
import { StarRating } from '../../components/ui/StarRating';
import { TagInput } from '../../components/ui/TagInput';

interface MangaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMangaInput | UpdateMangaInput) => void;
  initialData?: Manga;
  isEditMode?: boolean;
}

const DEFAULT_FORM_DATA: CreateMangaInput = {
  title: '',
  author: '',
  status: 'want-to-read',
  totalChapters: undefined,
  readChapters: 0,
  rating: undefined,
  tags: [],
  notes: ''
};

export const MangaForm: React.FC<MangaFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState<CreateMangaInput>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  const { getAllTags } = useMangaStore();
  const allTags = getAllTags();

  useEffect(() => {
    if (isOpen) {
      if (initialData && isEditMode) {
        setFormData({
          title: initialData.title,
          author: initialData.author || '',
          status: initialData.status,
          totalChapters: initialData.totalChapters,
          readChapters: initialData.readChapters,
          rating: initialData.rating,
          tags: initialData.tags,
          notes: initialData.notes || ''
        });
      } else {
        setFormData(DEFAULT_FORM_DATA);
      }
      setErrors({});
      setTagInput('');
    }
  }, [isOpen, initialData, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-save pending tag input if any
    let finalFormData = { ...formData };
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      finalFormData.tags = [...(formData.tags || []), tagInput.trim()];
      setTagInput(''); // Clear input after saving
    }

    if (validate(finalFormData)) {
      onSubmit(finalFormData);
      onClose();
    }
  };

  const validate = (data: CreateMangaInput = formData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.title.trim()) {
      newErrors.title = '請輸入漫畫名稱';
    }

    if (data.rating !== undefined && (data.rating < 0 || data.rating > 10)) {
      newErrors.rating = '評分必須在 0-10 之間';
    }

    if ((data.readChapters ?? 0) < 0) {
      newErrors.readChapters = '已閱讀話數不能為負數';
    }

    if (data.totalChapters !== undefined && (data.readChapters ?? 0) > data.totalChapters) {
      newErrors.readChapters = '已閱讀話數不能大於總話數';
    }

    // Note length validation (Requirement 4.3)
    if (data.notes && data.notes.length > 200) {
      newErrors.notes = '筆記不能超過 200 字';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === 'number') {
      newValue = value === '' ? undefined : Number(value);
    }

    setFormData((prev: CreateMangaInput) => ({ ...prev, [name]: newValue }));
  };

  const handleAddTag = (tag: string) => {
    if (!formData.tags?.includes(tag)) {
      setFormData((prev: CreateMangaInput) => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev: CreateMangaInput) => ({
      ...prev,
      tags: prev.tags?.filter((tag: string) => tag !== tagToRemove) || []
    }));
  };

  const handleRatingChange = (value: number) => {
    // 轉換 0-5 星為 0-10 分
    setFormData((prev: CreateMangaInput) => ({ ...prev, rating: value * 2 }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card-light dark:bg-bg-card-dark w-full max-w-2xl rounded-pixel-lg border-3 border-text-light dark:border-text-dark shadow-pixel max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-pixel text-pixel-primary">
              {isEditMode ? '編輯漫畫' : '新增漫畫'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">漫畫名稱 *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-pixel-sm border-2 bg-white dark:bg-gray-800 ${errors.title ? 'border-red-500' : 'border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary'
                    }`}
                  placeholder="例如: ONE PIECE"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">作者</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full p-3 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
                  placeholder="例如: 尾田榮一郎"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">狀態 *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 pr-8 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  {Object.entries(MANGA_STATUS_MAP).map(([key, info]: [string, any]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 進度與評分 */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-2">已讀話數</label>
                  <input
                    type="number"
                    name="readChapters"
                    min="0"
                    value={formData.readChapters}
                    onChange={handleChange}
                    className="w-full p-3 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
                  />
                  {errors.readChapters && <p className="text-red-500 text-xs mt-1">{errors.readChapters}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-2">總話數</label>
                  <input
                    type="number"
                    name="totalChapters"
                    min="0"
                    value={formData.totalChapters || ''}
                    onChange={handleChange}
                    className="w-full p-3 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
                    placeholder="未定"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">評分 (0-5)</label>
                <div className="py-2">
                  <StarRating
                    value={(formData.rating || 0) / 2}
                    onChange={handleRatingChange}
                    size="lg"
                  />
                </div>
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">標籤</label>
                <TagInput
                  tags={formData.tags || []}
                  onAddTag={handleAddTag}
                  onRemoveTag={removeTag}
                  inputValue={tagInput}
                  onInputChange={setTagInput}
                  suggestions={allTags}
                  placeholder="輸入標籤... (Enter 新增)"
                />
              </div>
            </div>

            {/* 筆記 (跨欄) */}
            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold">筆記</label>
                <span className={`text-xs ${(formData.notes?.length || 0) > 200
                  ? 'text-red-500 font-bold'
                  : 'text-text-muted-light dark:text-text-muted-dark'
                  }`}>
                  {formData.notes?.length || 0}/200
                </span>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 rounded-pixel-sm border-2 focus:border-pixel-primary bg-white dark:bg-gray-800 resize-none ${errors.notes
                  ? 'border-red-500'
                  : 'border-text-muted-light dark:border-text-muted-dark'
                  } ${(formData.notes?.length || 0) > 200 ? 'border-red-500' : ''}`}
                placeholder="寫下你的心得..."
              />
              {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-pixel-sm border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 font-pixel text-sm"
            >
              取消
            </button>
            <button
              type="submit"
              className="pixel-button pixel-button-primary px-8"
            >
              {isEditMode ? '儲存變更' : '新增漫畫'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
