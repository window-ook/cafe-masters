'use client';

import React, { useState, useEffect } from 'react';
import { useSearchedResultStore, useUIStore } from 'stores';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import { useCafeClickHandler } from '@/hooks/ui/useCafeClickHandler';
import SearchResult from '@/components/shared/sidebar/SearchResult';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function SearchedCafes() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const searchResult = useSearchedResultStore(state => state.searchResult);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const searchResultsPerPage = 15;
  const totalSearchResultPages = Math.ceil(searchResult.length / searchResultsPerPage);
  const paginatedResult = searchResult.slice((currentPage - 1) * searchResultsPerPage, currentPage * searchResultsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchResult]);

  const handleNextSearchResultPage = () => {
    if (currentPage < totalSearchResultPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchedCafeClick = useCafeClickHandler<IKakaoSearchResult>({
    routePath: 'search',
    shouldSetCurrentCafeId: false,
  });

  return (
    <div className="h-full flex flex-col">
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="pagination-sidebar-list">
          {paginatedResult.map((cafe: IKakaoSearchResult) => (
            <SearchResult
              key={cafe.id}
              name={cafe.place_name}
              address={cafe.road_address_name}
              phone_number={cafe.phone}
              onClickAction={() => handleSearchedCafeClick(cafe)}
            />
          ))}
        </ul>
      </section>

      {totalSearchResultPages > 1 && (
        <PageConverter
          isDarkTheme={isDarkTheme}
          handlePreviousPageAction={handlePreviousPageAction}
          handleNextPageAction={handleNextSearchResultPage}
          currentPage={currentPage}
          totalPages={totalSearchResultPages}
        />
      )}
    </div>
  );
}