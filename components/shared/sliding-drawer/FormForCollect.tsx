'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useCafeStore } from '@/stores/cafe';
import { collectionFormSchema, CollectionFormData } from '@/schema/collection';
import CategorySelector from './CategorySelector';
import RatingsSelector from './RatingsSelector';
import { useUIStore } from '@/stores';

export default function FormForCollect() {
  const pathname = usePathname();

  const { searchResult, collectedCafeDetail, bookmarkedCafeDetail, recommendedCafeDetail } = useCafeStore();
  const { isDarkTheme } = useUIStore();

  // 현재 페이지에 따라 카페 이름 결정
  const getCafeName = () => {
    if (pathname.startsWith('/search')) {
      return searchResult[0]?.place_name || '';
    }
    if (pathname.startsWith('/collected')) {
      return collectedCafeDetail[0]?.name || '';
    }
    if (pathname.startsWith('/bookmarked')) {
      return bookmarkedCafeDetail[0]?.name || '';
    }
    if (pathname.startsWith('/cafe/recommended')) {
      return recommendedCafeDetail[0]?.name || '';
    }
    return '';
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      rating: 0,
      categories: [],
      comment: '',
      eaten_menus: '',
      pros: '',
      cons: '',
    },
  });

  const onFormSubmit = (data: CollectionFormData) => {
    console.log(data);
  };

  const memoInputStyle = `${isDarkTheme ? 'text-black' : ''} px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent`;
  const memoSubmitStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} p-4 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all`;
  const memoBackStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} py-2 px-6 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 transition-all`;
  const errorStyle = 'text-red-500 text-sm mt-1 block';

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="font-dpixel text-2xl font-semibold">
          {getCafeName()}
        </p>
        <button
          type="button"
          aria-label="카드 수집 취소 버튼"
          // onClick={() => setMemoOpenAction(false)}
          className={memoBackStyle}
        >
          <span>Back</span>
        </button>
      </div>

      {/* 별점 선택 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span>별점 매기기</span>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <RatingsSelector
                data-cy="memo-rating"
                aria-label="카페의 별점을 매기는 라디오 그룹"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.rating && (
          <span className={errorStyle}>{errors.rating.message}</span>
        )}
      </div>

      {/* 카테고리 선택 */}
      <div className="flex flex-col gap-2">
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <CategorySelector
              selectedCategories={field.value}
              setSelectedCategoriesAction={field.onChange}
            />
          )}
        />
      </div>

      {/* 코멘트 입력 */}
      <div className="flex flex-col gap-2">
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              data-cy="memo-comment"
              placeholder="*코멘트"
              className={memoInputStyle}
            />
          )}
        />
        {errors.comment && (
          <span className={errorStyle}>{errors.comment.message}</span>
        )}
      </div>

      {/* 먹은 메뉴 입력 */}
      <div className="flex flex-col gap-2">
        <Controller
          name="eaten_menus"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              data-cy="memo-eaten"
              placeholder="*먹은 메뉴"
              className={memoInputStyle}
            />
          )}
        />
        {errors.eaten_menus && (
          <span className={errorStyle}>{errors.eaten_menus.message}</span>
        )}
      </div>

      {/* 좋은 점 입력 */}
      <div className="flex flex-col gap-2">
        <Controller
          name="pros"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              data-cy="memo-pros"
              placeholder="좋은 점"
              className={memoInputStyle}
            />
          )}
        />
        {errors.pros && (
          <span className={errorStyle}>{errors.pros.message}</span>
        )}
      </div>

      {/* 아쉬운 점 입력 */}
      <div className="flex flex-col gap-2">
        <Controller
          name="cons"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              data-cy="memo-cons"
              placeholder="아쉬운 점"
              className={memoInputStyle}
            />
          )}
        />
        {errors.cons && (
          <span className={errorStyle}>{errors.cons.message}</span>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        data-cy="memo-button"
        aria-label="카드 수집 완료 버튼"
        disabled={isSubmitting}
        className={memoSubmitStyle}
      >
        <span className="text-lg">
          {isSubmitting ? '저장 중...' : '완료'}
        </span>
      </button>
    </form>
  );
}
