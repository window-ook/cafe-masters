'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUIStore } from '@/stores';
import { useCreateRecommendedCafe } from '@/hooks/supabase/recommendation/useCreateRecommendedCafe';
import { useRecommendationStore } from '@/stores/recommendation';
import { recommendationFormSchema, RecommendationFormData } from '@/schema/recommendation';
import { RecommendationRowInsert } from '@/actions/supabase/recommendation';
import CategorySelector from '@/components/shared/sliding-drawer/CategorySelector';

export default function FormForRecommend({ setIsRecommendFormOpenAction }: { setIsRecommendFormOpenAction: (open: boolean) => void }) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const targetCafe = useRecommendationStore(state => state.targetCafe);

  const { createRecommendedCafe } = useCreateRecommendedCafe();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      categories: [],
    },
  });

  const onFormSubmit = async (data: RecommendationFormData) => {
    if (!targetCafe) {
      alert('추천할 카페 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      // 추천 데이터 생성
      const recommendationData: RecommendationRowInsert = {
        name: targetCafe.name,
        address: targetCafe.address,
        coordX: targetCafe.coordX,
        coordY: targetCafe.coordY,
        categories: JSON.stringify(data.categories),
        image: targetCafe.image || '',
        phone_number: targetCafe.phone_number || null,
        opening_time: targetCafe.opening_time || null,
        extra_images: JSON.stringify(targetCafe.extra_images || []),
        menus: null,
      };

      createRecommendedCafe(recommendationData);
      setIsRecommendFormOpenAction(false);
      alert('추천 카페로 추가했습니다!');
    } catch (error) {
      console.error('카페 추천 실패:', error);
      alert(error instanceof Error ? error.message : '카페 추천에 실패했습니다.');
    }
  };

  const memoSubmitStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} p-4 shadow-sm rounded-xl bg-main text-white cursor-pointer hover:bg-opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all`;
  const memoBackStyle = `${isDarkTheme ? 'shadow-main-shadow' : ''} py-2 px-6 shadow-sm rounded-xl bg-main text-white cursor-pointer hover:bg-opacity-70 transition-all`;
  const errorStyle = 'text-red-500 text-sm mt-1 block';

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">
          {targetCafe?.name || '카페 추천'}
        </p>
        <button
          type="button"
          aria-label="추천 취소 버튼"
          onClick={() => setIsRecommendFormOpenAction(false)}
          className={memoBackStyle}
        >
          <span>Back</span>
        </button>
      </div>

      {/* 카페 정보 표시 */}
      {targetCafe && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{targetCafe.address}</p>
          {targetCafe.phone_number && (
            <p className="text-sm text-gray-600">{targetCafe.phone_number}</p>
          )}
          {targetCafe.opening_time && (
            <p className="text-sm text-gray-600">{targetCafe.opening_time}</p>
          )}
        </div>
      )}

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
        {errors.categories && (
          <span className={errorStyle}>{errors.categories.message}</span>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        data-cy="recommend-button"
        aria-label="추천 완료 버튼"
        disabled={isSubmitting}
        className={memoSubmitStyle}
      >
        <span className="text-lg">
          {isSubmitting ? '추천 중...' : '추천 완료'}
        </span>
      </button>
    </form>
  );
}
