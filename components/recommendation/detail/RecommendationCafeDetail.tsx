'use client';

import { useRouter } from 'next/navigation';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { useCollectionStore } from '@/stores/collection';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';
import { ISupabaseRecommendationCafe } from '@/types/supabase/recommendation';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';

export default function RecommendationCafeDetail({ cafeId }: { cafeId: number }) {
  const router = useRouter();

  const userId = useUserStore(state => state.userId);
  const setTargetCafeForCollect = useCollectionStore(state => state.setTargetCafeForCollect);
  const isCollected = useCurrentCafeStore(state => state.isCollected);

  const { recommendationCafes } = useRecommendationCafes();

  const recommendationCafedetail = recommendationCafes?.find((cafe: ISupabaseRecommendationCafe) => cafe.id === cafeId);

  if (!recommendationCafedetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

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
    <>
      {/* 로그인 & 수집하지 않은 상태 */}
      {userId && !isCollected && <Button
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
      </Button>}

      {/* 로그아웃 상태 */}
      {!userId && <Button onClick={() => router.push('/signin')} customClassName='flex-1'>
        로그인하고 수집하기
      </Button>}
    </>
  );

  return (
    <article className="h-full rounded-md flex flex-col">
      <CafeDetailHeader
        bookmarkData={bookmarkData}
      />
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={cafeData}
        actionButtons={actionButtons}
        useImageWithFallback={false}
      />
    </article>
  );
}