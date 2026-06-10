import React, { useState, useRef } from 'react';

interface StarRatingProps {
  value: number; // 0-5
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md'
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    if (readOnly || !onChange) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;

    // Determine if hovering first half or second half
    const newValue = index + (percent > 0.5 ? 1 : 0.5);
    setHoverValue(newValue);
  };

  const handleClick = (value: number) => {
    if (readOnly || !onChange) return;
    onChange(value);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  const starSize = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  return (
    <div
      className="flex items-center gap-1"
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        // Calculate fill for this star
        // e.g. value = 3.5
        // index 0: fill 100%
        // index 1: fill 100%
        // index 2: fill 100%
        // index 3: fill 50%
        // index 4: fill 0%

        const starValue = displayValue - index;
        let fillState: 'full' | 'half' | 'empty' = 'empty';

        if (starValue >= 1) {
          fillState = 'full';
        } else if (starValue >= 0.5) {
          fillState = 'half';
        }

        return (
          <span
            key={index}
            className={`cursor-${readOnly ? 'default' : 'pointer'} relative ${starSize} transition-transform hover:scale-110`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={() => handleClick(hoverValue || value)}
            role={readOnly ? 'img' : 'button'}
            aria-label={`${index + 1} Star`}
          >
            {/* Background Empty Star */}
            <span className="text-gray-300 dark:text-gray-600">★</span>

            {/* Filled Star Overlay */}
            <span
              className={`absolute top-0 left-0 overflow-hidden text-yellow-400 ${fillState === 'half' ? 'w-1/2' : fillState === 'full' ? 'w-full' : 'w-0'
                }`}
            >
              ★
            </span>
          </span>
        );
      })}
      <span className="ml-2 text-sm text-text-muted-light dark:text-text-muted-dark font-mono">
        {displayValue.toFixed(1)}
      </span>
    </div>
  );
};
