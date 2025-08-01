import { CATEGORIES } from '@/utils/constants/categories';
import { RiResetLeftFill } from 'react-icons/ri';
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
        <a
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
        </a>
      ))}
      <button
        type="button"
        className="bg-main-light text-main px-4 py-2 rounded-full flex justify-center items-center transform duration-150 hover:opacity-60"
        onClick={resetCategories}
      >
        <RiResetLeftFill />
      </button>
    </div>
  );
}
