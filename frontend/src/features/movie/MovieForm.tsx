import React, { useState, useEffect } from 'react';
import type { CreateMovieInput, UpdateMovieInput, Movie } from './types';
import { MOVIE_STATUS_MAP } from './types';
import { useMovieStore } from './useMovieStore';
import { StarRating } from '../../components/ui/StarRating';
import { TagInput } from '../../components/ui/TagInput';

interface MovieFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMovieInput | UpdateMovieInput) => void;
  initialData?: Movie;
  isEditMode?: boolean;
}

const DEFAULT_FORM_DATA: CreateMovieInput = {
  title: '',
  director: '',
  status: 'want-to-watch',
  rating: undefined,
  tags: [],
  notes: ''
};

export const MovieForm: React.FC<MovieFormProps> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState<CreateMovieInput>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const { getAllTags } = useMovieStore();
  const allTags = getAllTags();

  useEffect(() => {
    if (isOpen) {
      if (initialData && isEditMode) {
        setFormData({
          title: initialData.title,
          director: initialData.director || '',
          status: initialData.status,
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

  const validate = (data: CreateMovieInput = formData): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.title.trim()) newErrors.title = '請輸入電影名稱';
    if (data.rating !== undefined && (data.rating < 0 || data.rating > 10)) newErrors.rating = '評分必須在 0-10 之間';
    if (data.notes && data.notes.length > 200) newErrors.notes = '筆記不能超過 200 字';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalData = { ...formData };
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      finalData.tags = [...(formData.tags || []), tagInput.trim()];
      setTagInput('');
    }
    if (validate(finalData)) {
      onSubmit(finalData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleAddTag = (tag: string) => {
    if (!formData.tags?.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) || [] }));
  };

  const handleRatingChange = (value: number) => {
    setFormData(prev => ({ ...prev, rating: value * 2 }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card-light dark:bg-bg-card-dark w-full max-w-2xl rounded-pixel-lg border-3 border-text-light dark:border-text-dark shadow-pixel max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-pixel text-pixel-primary">
              {isEditMode ? '編輯電影' : '新增電影'}
            </h2>
            <button type="button" onClick={onClose} className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本資訊 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">電影名稱 *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-pixel-sm border-2 bg-white dark:bg-gray-800 ${errors.title ? 'border-red-500' : 'border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary'}`}
                  placeholder="例如: 乘風破浪"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">導演</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className="w-full p-3 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
                  placeholder="例如: 韓寒"
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
                  {Object.entries(MOVIE_STATUS_MAP).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 評分與標籤 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">評分 (0-5)</label>
                <div className="py-2">
                  <StarRating value={(formData.rating || 0) / 2} onChange={handleRatingChange} size="lg" />
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

            {/* 筆記 */}
            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold">筆記</label>
                <span className={`text-xs ${(formData.notes?.length || 0) > 200 ? 'text-red-500 font-bold' : 'text-text-muted-light dark:text-text-muted-dark'}`}>
                  {formData.notes?.length || 0}/200
                </span>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 rounded-pixel-sm border-2 focus:border-pixel-primary bg-white dark:bg-gray-800 resize-none ${errors.notes ? 'border-red-500' : 'border-text-muted-light dark:border-text-muted-dark'}`}
                placeholder="寫下你的觀後感..."
              />
              {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-pixel-sm border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 font-pixel text-sm">
              取消
            </button>
            <button type="submit" className="pixel-button pixel-button-primary px-8">
              {isEditMode ? '儲存變更' : '新增電影'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
