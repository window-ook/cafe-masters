'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore } from 'stores';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import NormalCafe from '@/components/shared/sidebar/NormalCafe';
import PageConverter from '@/components/shared/sidebar/PageConverter';
import useThrottle from '@/hooks/shared/useThrottle';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';

export interface IRecommendedSidebarContentProps {
  className?: string;
}

export default function RecommendedSidebarContent({
}: IRecommendedSidebarContentProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();
  const { currentCafeId, setCurrentCoordX, setCurrentCoordY } = useMapStore();
  const { isDarkTheme, setIsSlidingDrawerOpen } = useUIStore();

  const fetchedRecommendedCafe = useRecommendedCafes();

  const recommendedPerPage = 5;
  const totalRecommendedPages = Math.ceil(
    (fetchedRecommendedCafe?.length || 0) / recommendedPerPage,
  );

  const paginatedRecommend = fetchedRecommendedCafe?.slice(
    (currentPage - 1) * recommendedPerPage,
    currentPage * recommendedPerPage,
  ) || [];

  const CARD_CONTAINER_STYLE = 'flex flex-col gap-8 my-8 px-8';

  // 데이터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [fetchedRecommendedCafe]);

  const handleNextRecommendedPage = () => {
    if (currentPage < totalRecommendedPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRecommendedCafeClick = useThrottle(
    (cafe: ISupabaseRecommendedCafe) => {
      setIsSlidingDrawerOpen(true);
      router.push(`/recommended/detail/${cafe.id}`);
      setCurrentCoordX(cafe.coordX);
      setCurrentCoordY(cafe.coordY);
    },
    5000,
    (cafe: ISupabaseRecommendedCafe) => cafe.id === currentCafeId,
  );

  return (
    <>
      {/* 추천 카페 리스트 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <section>
          <ul className={CARD_CONTAINER_STYLE}>
            {paginatedRecommend.map((cafe: ISupabaseRecommendedCafe) => (
              <NormalCafe
                key={cafe.id}
                name={cafe.name}
                address={cafe.address}
                phoneNum={cafe.phone_number}
                photoUrl={cafe.image}
                onClickAction={() => handleRecommendedCafeClick(cafe)}
              />
            ))}
          </ul>
        </section>
      </main>

      {/* 페이지네이션 */}
      {totalRecommendedPages > 1 && (
        <footer className="flex-none">
          <PageConverter
            isDarkTheme={isDarkTheme}
            handlePreviousPageAction={handlePreviousPageAction}
            handleNextPageAction={handleNextRecommendedPage}
            currentPage={currentPage}
            totalPages={totalRecommendedPages}
          />
        </footer>
      )}
    </>
  );
}