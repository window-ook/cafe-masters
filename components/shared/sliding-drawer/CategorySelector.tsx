import { CATEGORIES } from '@/utils/constants/categories';
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
          className={`cursor-pointer rounded-full border px-4 py-2 text-sm backdrop-blur-md transition-all duration-200 ease-out ${
            selectedCategories.includes(category)
              ? 'bg-main border-main text-white'
              : 'border-white/70 bg-white/60 text-gray-700 hover:bg-white/80'
          } `}
        >
          {category}
        </button>
      ))}
      <CategoryResetButton onReset={resetCategories} />
    </div>
  );
}
