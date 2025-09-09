'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRecommendationCafe } from '@/hooks/supabase/recommendation/useCreateRecommendationCafe';
import { useRecommendationStore } from '@/stores/recommendation';
import { recommendationFormSchema, RecommendationFormData } from '@/schema/recommendation';
import { RecommendationRowInsert } from '@/actions/supabase/recommendation';
import { toast } from 'react-toastify';
import CategorySelector from '@/components/shared/sliding-drawer/CategorySelector';
import Button from '@/components/shared/Button';

export default function FormForRecommend({ setIsRecommendFormOpenAction }: { setIsRecommendFormOpenAction: (open: boolean) => void }) {
  const targetCafeForRecommend = useRecommendationStore(state => state.targetCafeForRecommend);

  const { createRecommendationCafe } = useCreateRecommendationCafe();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      categories: [],
    },
  });

  const onFormSubmit = async (data: RecommendationFormData) => {
    if (!targetCafeForRecommend) {
      toast.warning('추천할 카페 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    try {
      // 추천 데이터 생성
      const recommendationData: RecommendationRowInsert = {
        id: targetCafeForRecommend.id,
        name: targetCafeForRecommend.name,
        address: targetCafeForRecommend.address,
        coordX: targetCafeForRecommend.coordX,
        coordY: targetCafeForRecommend.coordY,
        categories: JSON.stringify(data.categories),
        image: targetCafeForRecommend.image || '',
        phone_number: targetCafeForRecommend.phone_number || null,
        opening_time: targetCafeForRecommend.opening_time || null,
        extra_images: JSON.stringify(targetCafeForRecommend.extra_images || []),
        menus: null,
      };

      createRecommendationCafe(recommendationData);
      setIsRecommendFormOpenAction(false);
      toast.success('추천 카페로 추가했습니다!');
    } catch (error) {
      console.error('카페 추천 실패:', error);
      toast.error(error instanceof Error ? error.message : '카페 추천에 실패했습니다.');
    }
  };

  const errorStyle = 'text-red-500 text-sm mt-1 block';

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">
          {targetCafeForRecommend?.name || '카페 추천'}
        </p>
        <Button
          type="button"
          aria-label="추천 취소 버튼"
          text='Back'
          onClick={() => setIsRecommendFormOpenAction(false)}
        />
      </div>

      {/* 카페 정보 표시 */}
      {targetCafeForRecommend && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{targetCafeForRecommend.address}</p>
          {targetCafeForRecommend.phone_number && (
            <p className="text-sm text-gray-600">{targetCafeForRecommend.phone_number}</p>
          )}
          {targetCafeForRecommend.opening_time && (
            <p className="text-sm text-gray-600">{targetCafeForRecommend.opening_time}</p>
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
      <Button
        type="submit"
        aria-label="추천 완료 버튼"
        disabled={isSubmitting}
        text={isSubmitting ? '추천 중...' : '추천 완료'}
      />
    </form>
  );
}