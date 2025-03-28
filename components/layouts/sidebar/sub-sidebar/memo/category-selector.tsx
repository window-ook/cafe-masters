'use client';

export interface CategorySelectorProps {
  selectedCategories: string[];
  setSelectedCategoriesAction: (value: (prev: string[]) => string[]) => void;
}

export default function CategorySelector({
  selectedCategories,
  setSelectedCategoriesAction,
}: CategorySelectorProps) {
  const categories = [
    '조용한',
    '시끌벅적한',
    '콘센트 많은',
    '의자가 편한',
    '공간이 넓은',
    '전망 좋은',
    '빈티지한',
    '세련된',
    '특색있는',
    '밝은',
    '어두운',
    '빵 구운내 나는',
  ];

  const toggleCategories = (category: string) => {
    setSelectedCategoriesAction(prev =>
      prev.includes(category)
        ? prev.filter(t => t !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <a
          key={category}
          onClick={() => toggleCategories(category)}
          className={`px-4 py-2 rounded-full border transition text-sm cursor-pointer
            ${
              selectedCategories.includes(category)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }
          `}
        >
          {category}
        </a>
      ))}
    </div>
  );
}
