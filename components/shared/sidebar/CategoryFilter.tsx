'use client';

import { useState } from 'react';
import { useFilterStore } from '@/stores/filter';
import { useUIStore } from '@/stores';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '@/utils/constants/categories';
import CategoryResetButton from '@/components/shared/CategoryResetButton';

export default function CategoryFilter() {
  const selectedCategories = useFilterStore(state => state.selectedCategories);
  const setSelectedCategories = useFilterStore(
    state => state.setSelectedCategories,
  );
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleCategories = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(t => t !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
  };

  const resetCategories = () => setSelectedCategories([]);
  const toggleExpand = () => setIsExpanded(prev => !prev);

  return (
    <div className="flex flex-wrap justify-center gap-2 pt-2">
      <div
        className={`w-full overflow-hidden opacity-100 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {CATEGORIES.map(category => (
            <button
              type="button"
              aria-label={`카테고리 '${category}' 선택 버튼`}
              key={category}
              onClick={() => toggleCategories(category)}
              className={`rounded-full border px-4 py-2 text-sm backdrop-blur-md transition-all duration-200 ease-out ${
                selectedCategories.includes(category)
                  ? 'bg-main border-main text-white'
                  : isDarkTheme
                    ? 'border-gray-600/40 bg-gray-800/60 text-white hover:bg-gray-800/80'
                    : 'border-white/70 bg-white/60 text-gray-700 hover:bg-white/80'
              } `}
            >
              {category}
            </button>
          ))}
          <CategoryResetButton onReset={resetCategories} />
        </div>
      </div>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={toggleExpand}
        className={`flex w-full items-center justify-center rounded-full px-4 py-2 ${isDarkTheme ? 'hover:text-main text-white' : 'hover:text-main text-gray-700'} transition-all duration-200 ease-out`}
      >
        {isExpanded ? (
          <p className="flex items-center gap-1">
            <span>카테고리 접기</span>
            <ChevronUp />
          </p>
        ) : (
          <p className="flex items-center gap-1">
            <span>카테고리 펼치기</span>
            <ChevronDown />
          </p>
        )}
      </button>
    </div>
  );
}
