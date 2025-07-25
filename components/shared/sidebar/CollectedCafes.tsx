'use client';

import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore, useUserStore } from 'stores';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useInView } from 'react-intersection-observer';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import CollectedCafe from '@/components/shared/sidebar/CollectedCafe';
import PulseDot from '@/components/shared/sliding-drawer/PulseDot';

export default function CollectedCafes() {
  const router = useRouter();

  const { currentCafeId, setCurrentCoordX, setCurrentCoordY } = useMapStore();
  const { setIsSubSidebarOpen } = useUIStore();
  const { userId } = useUserStore();

  const {
    filteredData: filteredCollectedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCollectedCafes(userId, true);

  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (collectedInView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [collectedInView, hasNextPage, fetchNextPage, isFetchingNextPage]);


  const handleCollectedCafeClick = useCallback((cafe: ISupabaseCollectedCafe) => {
    if (cafe.id === currentCafeId) return; // 중복 클릭 명시적 방지
    setIsSubSidebarOpen(true);
    router.push(`/collected/detail/${cafe.id}`);
    setCurrentCoordX(cafe.coordX);
    setCurrentCoordY(cafe.coordY);
  }, [currentCafeId, router, setIsSubSidebarOpen, setCurrentCoordX, setCurrentCoordY]);

  return (
    <main className="relative overflow-y-auto overflow-x-hidden">
      {/* 수집된 카페 리스트 */}
      <ul className="flex flex-col gap-8 my-8 px-8">
        {filteredCollectedCafe.map((cafe: ISupabaseCollectedCafe) => (
          <CollectedCafe
            key={cafe.id}
            name={cafe.name}
            ratings={cafe.ratings!}
            photoUrl={cafe.image}
            address={cafe.address}
            phoneNum={cafe.phone_number!}
            onClickAction={() => handleCollectedCafeClick(cafe)}
          />
        ))}
      </ul>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && <PulseDot />}

      {/* 무한 스크롤 트리거 */}
      <div ref={collectedRef} className="h-8 w-88"></div>
    </main>
  );
}