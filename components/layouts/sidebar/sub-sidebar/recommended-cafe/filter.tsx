import { useEffect, useState } from 'react';
import { useMapStore } from 'utils/store';

export default function Filter() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 1. 버튼용 카테고리 배열
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

  // 2. recommendedCafe의 각 카페에서, 선택한 카테고리를 &&으로 가진 카페만 filter
  // 전역 상태로 공유되어야 함 -> 사이드바에서 normal-cafe를 매핑하기 때문에
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
    // 3. filteredCafe를 렌더시키도록 useEffect 활용하기
    const filteredRecommendedCafe = recommendedCafe.filter(cafe => {
      if (!cafe.category) return false; // 카테고리가 없으면 false
      try {
        const parsedCategory = JSON.parse(cafe.category) as string[];

        return selectedCategories.every(selected =>
          parsedCategory.includes(selected),
        );
      } catch (error) {
        console.error('카테고리 파싱 오류:', error);
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
