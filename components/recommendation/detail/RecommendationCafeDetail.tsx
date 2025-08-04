'use client';

import { useCollectionStore } from '@/stores/collection';
import { useRecommendedCafes } from '@/hooks/supabase/recommendation/useRecommendedCafes';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';

export default function RecommendationCafeDetail({ cafeId }: { cafeId: number }) {
  const { recommendedCafes } = useRecommendedCafes();
  const setTargetCafeForCollect = useCollectionStore(state => state.setTargetCafeForCollect);

  const recommendedCafedetail = recommendedCafes?.find((cafe: ISupabaseRecommendedCafe) => cafe.id === cafeId);

  if (!recommendedCafedetail) throw new Error('추천 카페의 상세 정보를 찾을 수 없습니다');

  const bookmarkData = {
    id: recommendedCafedetail.id,
    name: recommendedCafedetail.name,
    address: recommendedCafedetail.address,
    phone_number: recommendedCafedetail.phone_number || '',
    image: recommendedCafedetail.image || '',
    coordX: recommendedCafedetail.coordX,
    coordY: recommendedCafedetail.coordY,
    extra_images: recommendedCafedetail.extra_images || null,
    opening_time: recommendedCafedetail.opening_time || null,
    menus: recommendedCafedetail.menus ? JSON.parse(recommendedCafedetail.menus) : null,
  };

  const cafeData = {
    name: recommendedCafedetail.name,
    address: recommendedCafedetail.address,
    phone_number: recommendedCafedetail.phone_number || '',
    image: recommendedCafedetail.image || '',
    extra_images: recommendedCafedetail.extra_images || [],
    opening_time: recommendedCafedetail.opening_time || null,
    categories: recommendedCafedetail.categories,
    menus: recommendedCafedetail.menus ? (() => {
      try {
        return JSON.parse(recommendedCafedetail.menus);
      } catch {
        return null;
      }
    })() : null,
  };

  const actionButtons = (
    <Button
      onClick={() =>
        setTargetCafeForCollect({
          id: recommendedCafedetail.id,
          name: recommendedCafedetail.name,
          coordX: recommendedCafedetail.coordX,
          coordY: recommendedCafedetail.coordY,
          address: recommendedCafedetail.address,
          image: recommendedCafedetail.image,
          extra_images: recommendedCafedetail.extra_images || [],
          phone_number: recommendedCafedetail.phone_number,
          opening_time: recommendedCafedetail.opening_time,
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