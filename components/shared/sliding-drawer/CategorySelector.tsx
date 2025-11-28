import { CATEGORIES } from '@/constants/categories';
import { ICategorySelector } from '@/types/shared/form';
import CategoryResetButton from '@/components/shared/CategoryResetButton';

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
              ? 'bg-main text-white border-main'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }
          `}
        >
          {category}
        </button>
      ))}
      <CategoryResetButton onReset={resetCategories} />
    </div>
  );
}
