import React, { useState, useRef, useEffect } from 'react';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;

  // Controlled input
  inputValue: string;
  onInputChange: (value: string) => void;

  suggestions?: string[];
  placeholder?: string;
  className?: string; // For custom styling
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  inputValue,
  onInputChange,
  suggestions = [],
  placeholder = '輸入標籤...',
  className = ''
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(
    suggestion =>
      !tags.includes(suggestion) &&
      (inputValue.trim() === '' || suggestion.toLowerCase().includes(inputValue.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[activeSuggestionIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions.length > 0) {
        setActiveSuggestionIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions.length > 0) {
        setActiveSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange(value);
    setShowSuggestions(true);
    setActiveSuggestionIndex(0);
  };

  const addTag = (tag: string) => {
    onAddTag(tag);
    // Let parent handle clearing input if needed, but typically we clear it here
    // However, since it is controlled, we rely on parent updating inputValue?
    // Actually standard input behavior: usually we clear input after add.
    // I'll assume parent needs to clear it, but wait, `onAddTag` is void.
    // I should call onInputChange('') here to clear it.
    onInputChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-pixel-primary/10 text-pixel-primary rounded-sm text-xs flex items-center gap-1 animate-fade-in">
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="hover:text-red-500 font-bold ml-1"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full p-3 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800"
        placeholder={placeholder}
        onFocus={() => {
          setShowSuggestions(true);
        }}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border-2 border-text-muted-light dark:border-text-muted-dark rounded-pixel-sm shadow-lg z-50 max-h-48 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-4 py-2 cursor-pointer text-sm ${index === activeSuggestionIndex
                ? 'bg-pixel-primary/10 text-pixel-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
