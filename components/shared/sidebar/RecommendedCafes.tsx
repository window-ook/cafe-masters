'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from 'stores';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { useCafeClickHandler } from '@/hooks/ui/useCafeClickHandler';
import CafeItem from '@/components/shared/sidebar/CafeItem';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function RecommendedCafes() {
  const { isDarkTheme } = useUIStore();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { recommendedCafes } = useRecommendedCafes();

  const recommendedPerPage = 5;
  const totalRecommendedPages = Math.ceil((recommendedCafes?.length || 0) / recommendedPerPage);
  const paginatedRecommend = recommendedCafes?.slice((currentPage - 1) * recommendedPerPage, currentPage * recommendedPerPage) || [];

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
    <div className="h-full flex flex-col">
      <section className='flex-1 overflow-y-auto overflow-x-hidden'>
        <ul className="pagination-sidebar-list">
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

      {totalRecommendedPages > 1 && (
        <PageConverter
          isDarkTheme={isDarkTheme}
          handlePreviousPageAction={handlePreviousPageAction}
          handleNextPageAction={handleNextRecommendedPage}
          currentPage={currentPage}
          totalPages={totalRecommendedPages}
        />
      )}
    </div>
  );
}