import { CATEGORIES } from '@/utils/constants/categories';
import { RotateCcw } from 'lucide-react';
import { ICategorySelector } from '@/types/shared/form';

export default function CategorySelector({
  selectedCategories,
  setSelectedCategoriesAction,
}: ICategorySelector) {
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
          className={`px-4 py-2 rounded-full border transition text-sm cursor-pointer
            ${selectedCategories.includes(category)
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }
          `}
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
  );
}
