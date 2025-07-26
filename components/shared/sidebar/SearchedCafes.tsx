'use client';

import React, { useState, useEffect } from 'react';
import { useCafeStore, useUIStore } from 'stores';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import { useCafeClickHandler } from '@/hooks/shared/useCafeClickHandler';
import SearchResult from '@/components/shared/sidebar/SearchResult';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function SearchedCafes() {
  const { isDarkTheme } = useUIStore();
  const { searchResult } = useCafeStore();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const searchResultsPerPage = 15;
  const totalSearchResultPages = Math.ceil(searchResult.length / searchResultsPerPage);
  const paginatedResult = searchResult.slice((currentPage - 1) * searchResultsPerPage, currentPage * searchResultsPerPage);

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    setCurrentPage(1);
  }, [searchResult]);

  const handleNextSearchResultPage = () => {
    if (currentPage < totalSearchResultPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNormalCafeClick = useCafeClickHandler<IKakaoSearchResult>({
    routePath: 'search',
    shouldSetCurrentCafeId: false,
  });

  return (
    <main className="relative overflow-y-auto">
      {/* 검색 결과 리스트 */}
      <section className="flex-1 overflow-x-hidden">
        <ul className="my-8 px-8 flex flex-col gap-8">
          {paginatedResult.map((cafe: IKakaoSearchResult) => (
            <SearchResult
              key={cafe.id}
              name={cafe.place_name}
              address={cafe.road_address_name}
              phoneNum={cafe.phone}
              onClickAction={() => handleNormalCafeClick(cafe)}
            />
          ))}
        </ul>
      </section>

      {/* 페이지네이션 */}
      {totalSearchResultPages > 1 && (
        <footer className="flex-none sticky bottom-0">
          <PageConverter
            isDarkTheme={isDarkTheme}
            handlePreviousPageAction={handlePreviousPageAction}
            handleNextPageAction={handleNextSearchResultPage}
            currentPage={currentPage}
            totalPages={totalSearchResultPages}
          />
        </footer>
      )}
    </main>
  );
}