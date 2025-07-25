'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore } from 'stores';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import SearchResult from '@/components/shared/sidebar/SearchResult';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function SearchedCafes({ searchResult }: { searchResult: IKakaoSearchResult[] }) {
  const router = useRouter();

  const { currentCafeId, setCurrentCoordX, setCurrentCoordY } = useMapStore();
  const { isDarkTheme, setIsSubSidebarOpen } = useUIStore();

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

  const handleNormalCafeClick = useCallback((cafe: IKakaoSearchResult) => {
    if (Number(cafe.id) === currentCafeId) return; // 중복 클릭 명시적 방지
    setIsSubSidebarOpen(true);
    router.push(`/search/detail/${cafe.id}`);
    setCurrentCoordX(Number(cafe.x));
    setCurrentCoordY(Number(cafe.y));
  }, [currentCafeId, router, setIsSubSidebarOpen, setCurrentCoordX, setCurrentCoordY]);

  return (
    <main>
      {/* 검색 결과 리스트 */}
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
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
        <footer className="flex-none">
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