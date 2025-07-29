'use client';

import { useState } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import { CATEGORIES } from '@/utils/constants/categories';
import { RiResetLeftFill } from 'react-icons/ri';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

export default function CategoryFilter() {
  const selectedCategories = useFilterStore(state => state.selectedCategories);
  const setSelectedCategories = useFilterStore(state => state.setSelectedCategories);

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
            <a
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
            </a>
          ))}
          <button
            type="button"
            className="bg-main-light text-main px-4 py-2 rounded-full flex justify-center items-center transform duration-300 hover:opacity-60"
            onClick={resetCategories}
          >
            <RiResetLeftFill />
          </button>
        </>
      )}
      <button
        onClick={toggleExpand}
        className="w-full px-4 py-2 rounded-full flex justify-center items-center text-gray-700 hover:text-main transition"
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
