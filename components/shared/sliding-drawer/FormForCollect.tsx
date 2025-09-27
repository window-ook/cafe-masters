'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores';
import { useCollectionStore } from '@/stores/collection';
import { collectionFormSchema, CollectionFormData } from '@/schema/collection';
import { useUpdateCollectionCafe } from '@/hooks/supabase/collection/useUpdateCollectionCafe';
import { useCreateCollectionCafe } from '@/hooks/supabase/collection';
import { CONSOLE_ERROR, TOAST_ERROR, TOAST_SUCCESS } from '@/utils/constants/messages';
import { toast } from 'react-toastify';
import InputField from '@/components/shared/InputField';
import CategorySelector from '@/components/shared/sliding-drawer/CategorySelector';
import RatingsSelector from '@/components/shared/sliding-drawer/RatingsSelector';
import Button from '@/components/shared/Button';

export default function FormForCollect() {
  const pathname = usePathname();
  const targetCafeForCollect = useCollectionStore(state => state.targetCafeForCollect);
  const editingCafe = useCollectionStore(state => state.editingCafe);
  const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);
  const clearEditingCafe = useCollectionStore(state => state.clearEditingCafe);

  const { updateCollectionCafe } = useUpdateCollectionCafe();
  const { createCollectionCafe } = useCreateCollectionCafe();

  const isEditMode = pathname?.startsWith('/collection/detail/') && editingCafe;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: isEditMode ? {
      rating: editingCafe?.ratings || 0,
      categories: editingCafe?.categories || [],
      comment: editingCafe?.comment || '',
      eaten_menus: editingCafe?.eaten_menus || '',
      pros: editingCafe?.pros || '',
      cons: editingCafe?.cons || '',
    } : {
      rating: 0,
      categories: [],
      comment: '',
      eaten_menus: '',
      pros: '',
      cons: '',
    },
  });

  // 수정/수집 핸들러
  const onFormSubmit = async (data: CollectionFormData) => {
    if (isEditMode) {
      if (!editingCafe) {
        toast.error(TOAST_ERROR.NO_DATA_FOR_EDIT_COLLECTION);
        return;
      }

      try {
        const updateData = {
          ratings: data.rating,
          categories: JSON.stringify(data.categories),
          comment: data.comment,
          eaten_menus: data.eaten_menus,
          pros: data.pros || '',
          cons: data.cons || '',
        };

        updateCollectionCafe(updateData);

        clearEditingCafe();
        setIsCollectFormOpen(false);
        toast.success(TOAST_SUCCESS.EDIT_COLLECTION);

      } catch (error) {
        console.error(CONSOLE_ERROR.EDIT_COLLECTION_CAFE, error);
        toast.error(error instanceof Error ? error.message : TOAST_ERROR.EDIT_COLLECTION);
        clearEditingCafe();
        setIsCollectFormOpen(false);
      }
    } else {
      if (!targetCafeForCollect) {
        toast.error(TOAST_ERROR.NO_DATA_FOR_CREATE_COLLECTION);
        return;
      }

      try {
        // 완전한 수집 데이터 생성
        const collectionData = {
          id: targetCafeForCollect.id,
          name: targetCafeForCollect.name,
          coordX: targetCafeForCollect.coordX,
          coordY: targetCafeForCollect.coordY,
          address: targetCafeForCollect.address,
          image: targetCafeForCollect.image,
          extra_images: JSON.stringify(targetCafeForCollect.extra_images || []),
          phone_number: targetCafeForCollect.phone_number,
          opening_time: targetCafeForCollect.opening_time,
          ratings: data.rating,
          categories: JSON.stringify(data.categories),
          comment: data.comment,
          eaten_menus: data.eaten_menus,
          pros: data.pros || '',
          cons: data.cons || '',
        };

        createCollectionCafe(collectionData);
        setIsCollectFormOpen(false);
        toast.success(TOAST_SUCCESS.CREATE_COLLECTION);
      } catch (error) {
        console.error(CONSOLE_ERROR.CREATE_COLLECTION_CAFE, error);
        toast.error(error instanceof Error ? error.message : TOAST_ERROR.CREATE_COLLECTION);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className=" text-2xl font-semibold">
          {isEditMode ? editingCafe?.name : targetCafeForCollect?.name}
        </p>
        <Button
          type="button"
          aria-label={isEditMode ? "카드 수정 취소 버튼" : "카드 수집 취소 버튼"}
          text='Back'
          onClick={() => {
            if (isEditMode) clearEditingCafe();
            setIsCollectFormOpen(false);
          }}
        />
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
                ariaLabel="카페의 별점을 매기는 라디오 그룹"
                dataTestId="ratings-selector"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.rating && <span className="text-red-500 text-sm mt-1 block">{errors.rating.message}</span>}
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
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            id="comment"
            type="text"
            label="코멘트"
            dataTestId='comment-input'
            placeholder="*코멘트"
            disabled={isSubmitting}
            isError={errors.comment?.message}
          />
        )}
      />

      {/* 먹은 메뉴 입력 */}
      <Controller
        name="eaten_menus"
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            id="eaten_menus"
            type="text"
            label="먹은 메뉴"
            dataTestId='eaten-menus-input'
            placeholder="*먹은 메뉴"
            disabled={isSubmitting}
            isError={errors.eaten_menus?.message}
          />
        )}
      />

      {/* 좋은 점 입력 */}
      <Controller
        name="pros"
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            id="pros"
            type="text"
            label="좋은 점"
            placeholder="좋은 점"
            disabled={isSubmitting}
            isError={errors.pros?.message}
          />
        )}
      />

      {/* 아쉬운 점 입력 */}
      <Controller
        name="cons"
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            id="cons"
            type="text"
            label="아쉬운 점"
            placeholder="아쉬운 점"
            disabled={isSubmitting}
            isError={errors.cons?.message}
          />
        )}
      />

      {/* 제출 버튼 */}
      <Button
        type="submit"
        aria-label={isEditMode ? "카드 수정 완료 버튼" : "카드 수집 완료 버튼"}
        dataTestId="button-submit-collect"
        disabled={isSubmitting}
        text={isSubmitting ? (isEditMode ? '수정 중...' : '저장 중...') : '완료'}
      />
    </form>
  );
}