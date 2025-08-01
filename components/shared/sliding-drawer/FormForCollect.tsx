'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores';
import { useCollectionStore } from '@/stores/collection';
import { collectionFormSchema, CollectionFormData } from '@/schema/collection';
import { createCollectedCafe } from '@/actions/supabase/collection';
import { useUpdateCollectedCafe } from '@/hooks/supabase/collection/useUpdateCollectedCafe';
import InputField from '@/components/shared/InputField';
import CategorySelector from '@/components/shared/sliding-drawer/CategorySelector';
import RatingsSelector from '@/components/shared/sliding-drawer/RatingsSelector';
import Button from '../Button';

export default function FormForCollect() {
  const pathname = usePathname();
  const targetCafe = useCollectionStore(state => state.targetCafe);
  const editingCafe = useCollectionStore(state => state.editingCafe);
  const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);
  const clearEditingCafe = useCollectionStore(state => state.clearEditingCafe);

  const { updateCollectedCafe } = useUpdateCollectedCafe();

  // 편집 모드 감지
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

  const onFormSubmit = async (data: CollectionFormData) => {
    if (isEditMode) {
      // 편집 모드: 기존 카페 업데이트
      if (!editingCafe) {
        alert('편집할 카페 정보가 없습니다. 다시 시도해주세요.');
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

        // 업데이트 액션 호출
        updateCollectedCafe(updateData);

        // 성공 시 폼 닫기 및 편집 상태 초기화
        clearEditingCafe();
        setIsCollectFormOpen(false);
        alert('카페 정보가 성공적으로 수정되었습니다!');

      } catch (error) {
        console.error('카페 수정 실패:', error);
        alert(error instanceof Error ? error.message : '카페 수정에 실패했습니다.');
        clearEditingCafe();
        setIsCollectFormOpen(false);
      }
    } else {
      // 생성 모드: 새 카페 수집
      if (!targetCafe) {
        alert('카페 정보가 없습니다. 다시 시도해주세요.');
        return;
      }

      try {
        // 완전한 수집 데이터 생성
        const collectionData = {
          id: targetCafe.id,
          name: targetCafe.name,
          coordX: targetCafe.coordX,
          coordY: targetCafe.coordY,
          address: targetCafe.address,
          image: targetCafe.image,
          extra_images: JSON.stringify(targetCafe.extra_images || []),
          phone_number: targetCafe.phone_number,
          opening_time: targetCafe.opening_time,
          ratings: data.rating,
          categories: JSON.stringify(data.categories),
          comment: data.comment,
          eaten_menus: data.eaten_menus,
          pros: data.pros || '',
          cons: data.cons || '',
        };

        // 서버 액션 호출
        await createCollectedCafe(collectionData);

        // 성공 시 폼 닫기
        setIsCollectFormOpen(false);
        alert('카페가 성공적으로 수집되었습니다!');

      } catch (error) {
        console.error('카페 수집 실패:', error);
        alert(error instanceof Error ? error.message : '카페 수집에 실패했습니다.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <p className=" text-2xl font-semibold">
          {isEditMode ? editingCafe?.name : targetCafe?.name}
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
                aria-label="카페의 별점을 매기는 라디오 그룹"
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
        disabled={isSubmitting}
        text={isSubmitting ? (isEditMode ? '수정 중...' : '저장 중...') : '완료'}
      />
    </form>
  );
}
