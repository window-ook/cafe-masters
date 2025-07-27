'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from 'stores';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { useCafeClickHandler } from '@/hooks/ui/useCafeClickHandler';
import CafeItem from '@/components/shared/sidebar/CafeItem';
import PageConverter from '@/components/shared/sidebar/PageConverter';

const CARD_CONTAINER_STYLE = 'my-8 px-8 flex flex-col gap-8';

export default function RecommendedCafes() {
  const { isDarkTheme } = useUIStore();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { recommendedCafes } = useRecommendedCafes();

  const recommendedPerPage = 5;
  const totalRecommendedPages = Math.ceil((recommendedCafes?.length || 0) / recommendedPerPage);
  const paginatedRecommend = recommendedCafes?.slice((currentPage - 1) * recommendedPerPage, currentPage * recommendedPerPage) || [];

  // 데이터 변경 시 첫 페이지로 리셋
  useEffect(() => { setCurrentPage(1); }, [recommendedCafes]);

  const handleNextRecommendedPage = () => {
    if (currentPage < totalRecommendedPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRecommendedCafeClick = useCafeClickHandler<ISupabaseRecommendedCafe>({
    routePath: 'recommended',
    shouldSetCurrentCafeId: true,
  });

  return (
    <>
      {/* 추천 카페 리스트 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <section>
          <ul className={CARD_CONTAINER_STYLE}>
            {paginatedRecommend.map((cafe: ISupabaseRecommendedCafe) => (
              <CafeItem
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