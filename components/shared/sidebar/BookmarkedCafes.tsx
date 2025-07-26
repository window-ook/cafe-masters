'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { useCafeClickHandler } from '@/hooks/shared/useCafeClickHandler';
import NormalCafe from '@/components/shared/sidebar/NormalCafe';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function BookmarkedCafes() {
  const { isDarkTheme } = useUIStore();
  const { userId } = useUserStore();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    filteredData: filteredBookmarkedCafe,
  } = useBookmarkedCafes(userId, true);

  const bookmarkedCafesPerPage = 8;
  const totalBookmarkedCafePages = Math.ceil(filteredBookmarkedCafe.length / bookmarkedCafesPerPage);
  const paginatedBookmarkedCafes = filteredBookmarkedCafe.slice(
    (currentPage - 1) * bookmarkedCafesPerPage,
    currentPage * bookmarkedCafesPerPage
  );

  // 필터링 결과 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBookmarkedCafe.length]);

  const handleNextBookmarkedCafePage = () => {
    if (currentPage < totalBookmarkedCafePages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleBookmarkedCafeClick = useCafeClickHandler<ISupabaseBookmarkedCafe>({
    routePath: 'bookmarked',
    shouldSetCurrentCafeId: false,
  });

  return (
    <main className="relative overflow-y-auto overflow-x-hidden">
      {/* 북마크된 카페 리스트 */}
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="my-8 px-8 flex flex-col gap-8">
          {paginatedBookmarkedCafes.map((cafe: ISupabaseBookmarkedCafe) => (
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

      {/* 페이지네이션 */}
      {totalBookmarkedCafePages > 1 && (
        <footer className="flex-none">
          <PageConverter
            isDarkTheme={isDarkTheme}
            handlePreviousPageAction={handlePreviousPageAction}
            handleNextPageAction={handleNextBookmarkedCafePage}
            currentPage={currentPage}
            totalPages={totalBookmarkedCafePages}
          />
        </footer>
      )}
    </main>
  );
}