'use client';

import { useUIStore } from '@/stores';
import CategorySelector from './CategorySelector';

export default function FormForRecommend({ setIsRecommendFormOpenAction }: { setIsRecommendFormOpenAction: (open: boolean) => void }) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const memoSubmitStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} p-4 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;
  const memoBackStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} py-2 px-6 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;

  return (
    <section className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">
          카페
        </p>
        <button
          type="button"
          aria-label="추천 중 취소 버튼"
          onClick={() => setIsRecommendFormOpenAction(false)}
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
