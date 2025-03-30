'use client';

import { useEffect, useState } from 'react';
import { useMapStore } from 'utils/store';
import { categories } from '../shared/categories';

export default function Filter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const recommendedCafe = useMapStore(state => state.recommendedCafe);
  const setFilteredRecommendedCafe = useMapStore(
    state => state.setFilteredRecommendedCafe,
  );

  const toggleCategories = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(t => t !== category)
        : [...prev, category],
    );
  };

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
    </div>
  );
}
