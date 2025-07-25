'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore, useUserStore } from 'stores';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useInView } from 'react-intersection-observer';
import NormalCafe from '@/components/shared/sidebar/NormalCafe';
import PulseDot from '@/components/shared/sliding-drawer/PulseDot';
import useThrottle from '@/hooks/shared/useThrottle';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';

export interface IBookmarkedSidebarContentProps {
  className?: string;
}

export default function BookmarkedSidebarContent({
  className = '',
}: IBookmarkedSidebarContentProps) {
  const router = useRouter();
  const { currentCafeId, setCurrentCoordX, setCurrentCoordY } = useMapStore();
  const { setIsSubSidebarOpen } = useUIStore();
  const { userId } = useUserStore();

  const {
    filteredData: filteredBookmarkedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookmarkedCafes(userId, true);

  const { ref: bookmarkedRef, inView: bookmarkedInView } = useInView({
    threshold: 0.5,
  });

  // 무한 스크롤 처리
  React.useEffect(() => {
    if (bookmarkedInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [bookmarkedInView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const CARD_CONTAINER_STYLE = 'flex flex-col gap-8 my-8 px-8';

  const handleBookmarkedCafeClick = useThrottle(
    (cafe: ISupabaseBookmarkedCafe) => {
      setIsSubSidebarOpen(true);
      router.push(`/bookmarked/detail/${cafe.id}`);
      setCurrentCoordX(cafe.coordX);
      setCurrentCoordY(cafe.coordY);
    },
    5000,
    (cafe: ISupabaseBookmarkedCafe) => cafe.id === currentCafeId,
  );

  return (
    <main className={`relative overflow-y-auto overflow-x-hidden ${className}`}>
      {/* 북마크된 카페 리스트 */}
      <section>
        <ul className={CARD_CONTAINER_STYLE}>
          {filteredBookmarkedCafe.map((cafe: ISupabaseBookmarkedCafe) => (
            <NormalCafe
              key={cafe.id}
              name={cafe.name}
              address={cafe.address}
              phoneNum={cafe.phone_number}
              photoUrl={cafe.image}
              onClickAction={() => handleBookmarkedCafeClick(cafe)}
            />
          ))}
        </ul>
      </section>

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && <PulseDot />}

      {/* 무한 스크롤 트리거 */}
      <div ref={bookmarkedRef} className="h-8 w-88"></div>
    </main>
  );
}