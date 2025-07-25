'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore } from 'stores';
import SearchResult from '@/components/shared/sidebar/SearchResult';
import PageConverter from '@/components/shared/sidebar/PageConverter';
import useThrottle from '@/hooks/shared/useThrottle';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';

export interface ISearchSidebarContentProps {
  searchResult: IKakaoSearchResult[];
  className?: string;
}

export default function SearchSidebarContent({
  searchResult,
}: ISearchSidebarContentProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();
  const { currentCafeId, setCurrentCoordX, setCurrentCoordY } = useMapStore();
  const { isDarkTheme, setIsSubSidebarOpen } = useUIStore();

  const searchResultsPerPage = 15;
  const totalSearchResultPages = Math.ceil(
    searchResult.length / searchResultsPerPage,
  );

  const paginatedResult = searchResult.slice(
    (currentPage - 1) * searchResultsPerPage,
    currentPage * searchResultsPerPage,
  );

  const CARD_CONTAINER_STYLE = 'flex flex-col gap-8 my-8 px-8';

  // 페이지 변경 시 맨 위로 스크롤
  useEffect(() => {
    setCurrentPage(1);
  }, [searchResult]);

  const handleNextSearchResultPage = () => {
    if (currentPage < totalSearchResultPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNormalCafeClick = useThrottle(
    (cafe: IKakaoSearchResult) => {
      setIsSubSidebarOpen(true);
      router.push(`/search/detail/${cafe.id}`);
      setCurrentCoordX(Number(cafe.x));
      setCurrentCoordY(Number(cafe.y));
    },
    5000,
    (cafe: IKakaoSearchResult) => parseInt(cafe.id) === currentCafeId,
  );

  return (
    <>
      {/* 검색 결과 리스트 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <section>
          <ul className={CARD_CONTAINER_STYLE}>
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
      </main>

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
    </>
  );
}