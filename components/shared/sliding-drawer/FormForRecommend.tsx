'use client';

import { usePathname } from 'next/navigation';
import CategorySelector from './CategorySelector';

interface IFormForRecommend {
  detailName: string;
  bookmarkedCafeDetailName: string;
  isDarkTheme: boolean;
  setMemoRecommendationOpenAction: (open: boolean) => void;
}

export default function FormForRecommend({
  detailName,
  bookmarkedCafeDetailName,
  isDarkTheme,
  setMemoRecommendationOpenAction,
}: IFormForRecommend) {
  const pathname = usePathname();

  const memoSubmitStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} p-4 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;
  const memoBackStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} py-2 px-6 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;

  return (
    <section className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="font-dpixel text-2xl font-semibold">
          {pathname.startsWith('/search') && detailName}
          {pathname.startsWith('/bookmarked') && bookmarkedCafeDetailName}
        </p>
        <button
          type="button"
          aria-label="추천 중 취소 버튼"
          onClick={() => setMemoRecommendationOpenAction(false)}
          className={memoBackStyle}
        >
          <span>Back</span>
        </button>
      </div>
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategoriesAction={() => { }}
      />
      <button
        data-cy="recommend-button"
        aria-label="추천 완료 버튼"
        className={memoSubmitStyle}
      >
        <span className="text-lg">완료</span>
      </button>
    </section>
  );
}
