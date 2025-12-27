'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRecommendationCafe } from '@/hooks/supabase/recommendation/useCreateRecommendationCafe';
import { useRecommendationStore } from '@/stores/recommendation';
import {
  recommendationFormSchema,
  RecommendationFormData,
} from '@/schema/recommendation';
import { RecommendationRowInsert } from '@/actions/supabase/recommendation';
import { TOAST_SUCCESS, TOAST_ERROR, TOAST_WARN } from '@/utils/constants/messages';
import { toast } from 'react-toastify';
import CategorySelector from '@/components/shared/sliding-drawer/CategorySelector';
import Button from '@/components/shared/Button';

export default function FormForRecommend({
  setIsRecommendFormOpenAction,
}: {
  setIsRecommendFormOpenAction: (open: boolean) => void;
}) {
  const targetCafeForRecommend = useRecommendationStore(
    state => state.targetCafeForRecommend,
  );

  const { createRecommendationCafe } = useCreateRecommendationCafe();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecommendationFormData>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      categories: [],
    },
  });

  const onFormSubmit = async (data: RecommendationFormData) => {
    if (!targetCafeForRecommend) {
      toast.warning(TOAST_WARN.NO_DATA_FOR_RECOMMEND);
      return;
    }

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

    try {
      await createRecommendationCafe(recommendationData);
      toast.success(TOAST_SUCCESS.CREATE_RECOMMENDATION);
      setIsRecommendFormOpenAction(false);
    } catch {
      toast.error(TOAST_ERROR.CREATE_RECOMMENDATION);
    }
  };

  const errorStyle = 'text-red-500 text-sm mt-1 block';

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4 p-2"
    >
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold">
          {targetCafeForRecommend?.name || '카페 추천'}
        </p>
        <Button
          type="button"
          aria-label="추천 취소 버튼"
          text="Back"
          onClick={() => setIsRecommendFormOpenAction(false)}
        />
      </div>

      {/* 카페 정보 표시 */}
      {targetCafeForRecommend && (
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            {targetCafeForRecommend.address}
          </p>
          {targetCafeForRecommend.phone_number && (
            <p className="text-sm text-gray-600">
              {targetCafeForRecommend.phone_number}
            </p>
          )}
          {targetCafeForRecommend.opening_time && (
            <p className="text-sm text-gray-600">
              {targetCafeForRecommend.opening_time}
            </p>
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
