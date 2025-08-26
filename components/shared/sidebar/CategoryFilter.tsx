'use client';

import { useState } from 'react';
import { useFilterStore } from '@/stores/filter';
import { useUIStore } from '@/stores';
import { CATEGORIES } from '@/utils/constants/categories';
import { RotateCcw } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function CategoryFilter() {
  const selectedCategories = useFilterStore(state => state.selectedCategories);
  const setSelectedCategories = useFilterStore(state => state.setSelectedCategories);
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
    <div className="pt-2 flex flex-wrap justify-center gap-2">
      <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {CATEGORIES.map(category => (
            <button
              type="button"
              aria-label={`카테고리 '${category}' 선택 버튼`}
              key={category}
              onClick={() => toggleCategories(category)}
              className={`px-4 py-2 rounded-full border transition text-sm cursor-pointer
                ${selectedCategories.includes(category)
                  ? 'bg-main text-white border-main'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            >
              {category}
            </button>
          ))}
          <button
            type="button"
            className="bg-main-light text-main px-4 py-2 rounded-full flex justify-center items-center cursor-pointer transform duration-150 hover:opacity-60"
            onClick={resetCategories}
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={toggleExpand}
        className={`w-full px-4 py-2 rounded-full flex justify-center items-center ${isDarkTheme ? 'text-white' : 'text-gray-700'} hover:text-main cursor-pointer transition duration-150`}
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
