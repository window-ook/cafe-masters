'use client';

import { useEffect, useState } from 'react';
import { useMapStore } from 'utils/store';
import { categories } from '../sub-sidebar/shared/categories';
import { RiResetLeftFill } from 'react-icons/ri';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

export default function CategoryFilter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const { recommendedCafe, setFilteredRecommendedCafe } = useMapStore();

  const toggleCategories = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(t => t !== category)
        : [...prev, category],
    );
  };

  const resetCategories = () => setSelectedCategories(() => []);

  const toggleExpand = () => setIsExpanded(prev => !prev);

  useEffect(() => {
    const filteredRecommendedCafe = recommendedCafe.filter(cafe => {
      if (!cafe.category) return false;
      try {
        const parsedCategory = JSON.parse(cafe.category) as string[];

        return selectedCategories.every(selected =>
          parsedCategory.includes(selected),
        );
      } catch (error) {
        console.error('카테고리 parsing error:', error);
        return false;
      }
    });

    setFilteredRecommendedCafe(filteredRecommendedCafe);
  }, [recommendedCafe, selectedCategories, setFilteredRecommendedCafe]);

  return (
    <div className="pt-2 flex flex-wrap justify-center gap-2">
      {isExpanded && (
        <>
          {categories.map(category => (
            <a
              key={category}
              onClick={() => toggleCategories(category)}
              className={`px-4 py-2 rounded-full border transition text-sm cursor-pointer
                ${
                  selectedCategories.includes(category)
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
          <p className="flex items-center gap-1 font-dpixel">
            <span>접기</span>
            <FaChevronUp />
          </p>
        ) : (
          <p className="flex items-center gap-1 font-dpixel">
            <span>펼치기</span>
            <FaChevronDown />
          </p>
        )}
      </button>
    </div>
  );
}
