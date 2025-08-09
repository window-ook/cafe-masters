'use client';

import { useState } from 'react';
import { useFilterStore } from '@/stores/filter';
import { CATEGORIES } from '@/utils/constants/categories';
import { RiResetLeftFill } from 'react-icons/ri';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { useUIStore } from '@/stores';

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
      {isExpanded && (
        <>
          {CATEGORIES.map(category => (
            <button
              type="button"
              aria-label={`카테고리 '${category}' 선택 버튼`}
              key={category}
              onClick={() => toggleCategories(category)}
              className={`px-4 py-2 rounded-full border transition text-sm cursor-pointer
                ${selectedCategories.includes(category)
                  ? 'bg-main text-white border-main'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              {category}
            </button>
          ))}
          <button
            type="button"
            className="bg-main-light text-main px-4 py-2 rounded-full flex justify-center items-center transform duration-150 hover:opacity-60"
            onClick={resetCategories}
          >
            <RiResetLeftFill />
          </button>
        </>
      )}
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={toggleExpand}
        className={`w-full px-4 py-2 rounded-full flex justify-center items-center ${isDarkTheme ? 'text-white' : 'text-gray-700'} hover:text-main cursor-pointer transition duration-150`}
      >
        {isExpanded ? (
          <p className="flex items-center gap-1 ">
            <span>접기</span>
            <FaChevronUp />
          </p>
        ) : (
          <p className="flex items-center gap-1 ">
            <span>펼치기</span>
            <FaChevronDown />
          </p>
        )}
      </button>
    </div>
  );
}
