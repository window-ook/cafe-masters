'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore, useUserStore } from 'stores';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useInView } from 'react-intersection-observer';
import CollectedCafe from '@/components/shared/sidebar/CollectedCafe';
import PulseDot from '@/components/shared/sliding-drawer/PulseDot';
import useThrottle from '@/hooks/shared/useThrottle';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';

export interface ICollectedSidebarContentProps {
  className?: string;
}

export default function CollectedSidebarContent({
  className = '',
}: ICollectedSidebarContentProps) {
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

  // 무한 스크롤 처리
  React.useEffect(() => {
    if (collectedInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [collectedInView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const CARD_CONTAINER_STYLE = 'flex flex-col gap-8 my-8 px-8';

  const handleCollectedCafeClick = useThrottle(
    (cafe: ISupabaseCollectedCafe) => {
      setIsSubSidebarOpen(true);
      router.push(`/collected/detail/${cafe.id}`);
      setCurrentCoordX(cafe.coordX);
      setCurrentCoordY(cafe.coordY);
    },
    5000,
    (cafe: ISupabaseCollectedCafe) => cafe.id === currentCafeId,
  );

  return (
    <main className={`relative overflow-y-auto overflow-x-hidden ${className}`}>
      {/* 수집된 카페 리스트 */}
      <section>
        <ul className={CARD_CONTAINER_STYLE}>
          {filteredCollectedCafe.map((cafe: ISupabaseCollectedCafe) => (
            <CollectedCafe
              key={cafe.id}
              name={cafe.name}
              ratings={cafe.ratings}
              photoUrl={cafe.image}
              address={cafe.address}
              phoneNum={cafe.phone_number}
              onClickAction={() => handleCollectedCafeClick(cafe)}
            />
          ))}
        </ul>
      </section>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && <PulseDot />}

      {/* 무한 스크롤 트리거 */}
      <div ref={collectedRef} className="h-8 w-88"></div>
    </main>
  );
}