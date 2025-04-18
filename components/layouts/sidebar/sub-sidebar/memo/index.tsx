'use client';

import { usePathname } from 'next/navigation';
import CategorySelector, { CategorySelectorProps } from './category-selector';
import Rating from './rating';

interface MemoProps extends CategorySelectorProps {
  detailName: string;
  collectedCafeDetailName: string;
  bookmarkedCafeDetailName: string;
  recommendedCafeDetailName: string;
  comment: string;
  pros: string;
  cons: string;
  eaten: string;
  setCommentAction: (comment: string) => void;
  setProsAction: (pros: string) => void;
  setConsAction: (cons: string) => void;
  setEatenAction: (eaten: string) => void;
  isDarkTheme: boolean;
  setMemoOpenAction: (open: boolean) => void;
  setRatingAction: (rating: number) => void;
  rating: number;
}

export default function Memo({
  detailName,
  collectedCafeDetailName,
  bookmarkedCafeDetailName,
  recommendedCafeDetailName,
  rating,
  selectedCategories,
  comment,
  pros,
  cons,
  eaten,
  isDarkTheme,
  setMemoOpenAction,
  setRatingAction,
  setSelectedCategoriesAction,
  setCommentAction,
  setProsAction,
  setConsAction,
  setEatenAction,
}: MemoProps) {
  const pathname = usePathname();

  const memoInputStyle = `${isDarkTheme ? 'text-black' : ''} rounded-lg`;
  const memoSubmitStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} p-4 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;
  const memoBackStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} py-2 px-6 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;

  return (
    <section className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="font-dpixel text-2xl font-semibold">
          {pathname.startsWith('/cafe/search') && detailName}
          {pathname.startsWith('/cafe/collected') && collectedCafeDetailName}
          {pathname.startsWith('/cafe/bookmarked') && bookmarkedCafeDetailName}
          {pathname.startsWith('/cafe/recommended') &&
            recommendedCafeDetailName}
        </p>
        <button
          type="button"
          aria-label="카드 수집 취소 버튼"
          onClick={() => setMemoOpenAction(false)}
          className={memoBackStyle}
        >
          <span>Back</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span>별점 매기기</span>
        <Rating
          data-cy="memo-rating"
          aria-label="카페의 별점을 매기는 라디오 그룹"
          value={rating}
          onChange={value => setRatingAction(value)}
        />
      </div>
      <CategorySelector
        selectedCategories={selectedCategories}
        setSelectedCategoriesAction={setSelectedCategoriesAction}
      />
      <input
        data-cy="memo-comment"
        required
        value={comment}
        placeholder="*코멘트"
        onChange={e => setCommentAction(e.target.value)}
        className={memoInputStyle}
      />
      <input
        data-cy="memo-eaten"
        required
        value={eaten}
        placeholder="*먹은 메뉴"
        onChange={e => setEatenAction(e.target.value)}
        className={memoInputStyle}
      />
      <input
        data-cy="memo-pros"
        value={pros}
        placeholder="좋은 점"
        onChange={e => setProsAction(e.target.value)}
        className={memoInputStyle}
      />
      <input
        data-cy="memo-cons"
        placeholder="아쉬운 점"
        value={cons}
        onChange={e => setConsAction(e.target.value)}
        className={memoInputStyle}
      />
      <button
        data-cy="memo-button"
        aria-label="카드 수집 완료 버튼"
        className={memoSubmitStyle}
      >
        <span className="text-lg">완료</span>
      </button>
    </section>
  );
}
