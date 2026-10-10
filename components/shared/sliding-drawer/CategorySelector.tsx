'use client';

import { useUIStore } from '@/stores';
import { CATEGORIES } from '@/utils/constants/categories';
import { ICategorySelector } from '@/types/shared/form';
import CategoryResetButton from '@/components/shared/CategoryResetButton';

export default function CategorySelector({
  selectedCategories,
  setSelectedCategoriesAction,
}: ICategorySelector) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const toggleCategories = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(t => t !== category)
      : [...selectedCategories, category];
    setSelectedCategoriesAction(newCategories);
  };

  const resetCategories = () => setSelectedCategoriesAction([]);

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(category => (
        <button
          type="button"
          aria-label={`카테고리 '${category}' 선택 버튼`}
          key={category}
          onClick={() => toggleCategories(category)}
          className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-all duration-200 ease-out ${
            selectedCategories.includes(category)
              ? 'bg-main border-main text-white'
              : isDarkTheme
                ? 'border-paper-dark-edge bg-case-dark text-gray-300 hover:bg-gray-700'
                : 'border-paper-edge bg-case text-gray-700 hover:bg-white'
          } `}
        >
          {category}
        </button>
      ))}
      <CategoryResetButton onReset={resetCategories} />
    </div>
  );
}
