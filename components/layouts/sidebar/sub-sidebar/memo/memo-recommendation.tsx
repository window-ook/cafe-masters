import { usePathname } from 'next/navigation';
import CategorySelector, { CategorySelectorProps } from './category-selector';
import { getMemoBackStyle, getMemoSubmitStyle } from 'utils/styles';

interface MemoRecommendationProps extends CategorySelectorProps {
  detailName: string;
  bookmarkedCafeDetailName: string;
  isDarkTheme: boolean;
  setMemoRecommendationOpen: (open: boolean) => void;
}

export default function MemoRecommendation({
  detailName,
  bookmarkedCafeDetailName,
  isDarkTheme,
  setMemoRecommendationOpen,
  selectedCategories,
  setSelectedCategoriesAction,
}: MemoRecommendationProps) {
  const pathname = usePathname();

  return (
    <section className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="font-dpixel text-2xl font-semibold">
          {pathname.startsWith('/cafe/search') && detailName}
          {pathname.startsWith('/cafe/bookmarked') && bookmarkedCafeDetailName}
        </p>
        <button
          type="button"
          aria-label="추천 중 취소 버튼"
          onClick={() => setMemoRecommendationOpen(false)}
          className={getMemoBackStyle(isDarkTheme)}
        >
          <span>Back</span>
        </button>
      </div>
      <CategorySelector
        selectedCategories={selectedCategories}
        setSelectedCategoriesAction={setSelectedCategoriesAction}
      />
      <button
        data-cy="recommend-button"
        aria-label="추천 완료 버튼"
        className={getMemoSubmitStyle(isDarkTheme)}
      >
        <span className="text-lg">완료</span>
      </button>
    </section>
  );
}
