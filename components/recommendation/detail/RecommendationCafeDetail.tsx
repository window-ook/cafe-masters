'use client';

import { useCollectionStore } from '@/stores/collection';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';
import { ISupabaseRecommendationCafe } from '@/types/supabase/recommendation';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';

export default function RecommendationCafeDetail({ cafeId }: { cafeId: number }) {
  const { recommendationCafes } = useRecommendationCafes();
  const setTargetCafeForCollect = useCollectionStore(state => state.setTargetCafeForCollect);

  const recommendationCafedetail = recommendationCafes?.find((cafe: ISupabaseRecommendationCafe) => cafe.id === cafeId);

  if (!recommendationCafedetail) throw new Error('추천 카페의 상세 정보를 찾을 수 없습니다');

  const bookmarkData = {
    id: recommendationCafedetail.id,
    name: recommendationCafedetail.name,
    address: recommendationCafedetail.address,
    phone_number: recommendationCafedetail.phone_number || '',
    image: recommendationCafedetail.image || '',
    coordX: recommendationCafedetail.coordX,
    coordY: recommendationCafedetail.coordY,
    extra_images: recommendationCafedetail.extra_images || null,
    opening_time: recommendationCafedetail.opening_time || null,
    menus: recommendationCafedetail.menus ? JSON.parse(recommendationCafedetail.menus) : null,
  };

  const cafeData = {
    name: recommendationCafedetail.name,
    address: recommendationCafedetail.address,
    phone_number: recommendationCafedetail.phone_number || '',
    image: recommendationCafedetail.image || '',
    extra_images: recommendationCafedetail.extra_images || [],
    opening_time: recommendationCafedetail.opening_time || null,
    categories: recommendationCafedetail.categories,
    menus: recommendationCafedetail.menus ? (() => {
      try {
        return JSON.parse(recommendationCafedetail.menus);
      } catch {
        return null;
      }
    })() : null,
  };

  const actionButtons = (
    <Button
      onClick={() =>
        setTargetCafeForCollect({
          id: recommendationCafedetail.id,
          name: recommendationCafedetail.name,
          coordX: recommendationCafedetail.coordX,
          coordY: recommendationCafedetail.coordY,
          address: recommendationCafedetail.address,
          image: recommendationCafedetail.image,
          extra_images: recommendationCafedetail.extra_images || [],
          phone_number: recommendationCafedetail.phone_number,
          opening_time: recommendationCafedetail.opening_time,
        })}
      customClassName='flex-1'
    >
      수집하기
    </Button>
  );

  return (
    <div className="h-full rounded-md flex flex-col">
      <CafeDetailHeader
        bookmarkData={bookmarkData}
      />
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={cafeData}
        actionButtons={actionButtons}
        useImageWithFallback={false}
      />
    </div>
  );
}