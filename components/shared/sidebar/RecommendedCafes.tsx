'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from 'stores';
import { useFilterStore } from '@/stores/filterStore';
import { useRecommendedCafes } from '@/hooks/supabase/recommendation/useRecommendedCafes';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import CafeItem from '@/components/shared/sidebar/CafeItem';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function RecommendedCafes() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const selectedCategories = useFilterStore(state => state.selectedCategories);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { filteredRecommendedCafes } = useRecommendedCafes(selectedCategories);

  const recommendedPerPage = 5;
  const totalRecommendedPages = Math.ceil((filteredRecommendedCafes?.length || 0) / recommendedPerPage);
  const paginatedRecommend = filteredRecommendedCafes?.slice((currentPage - 1) * recommendedPerPage, currentPage * recommendedPerPage) || [];

  useEffect(() => { setCurrentPage(1); }, [filteredRecommendedCafes]);

  const handleNextRecommendedPage = () => {
    if (currentPage < totalRecommendedPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRecommendedCafeClick = useCafeClick<ISupabaseRecommendedCafe>({
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
              phone_number={cafe.phone_number}
              image={cafe.image}
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