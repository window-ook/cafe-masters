'use client';

import React, { useState, useEffect } from 'react';
import { useSearchedResultStore, useUIStore } from 'stores';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import { IKakaoSearchResult } from '@/types/kakao-map';
import { IMAGE_PATHS } from '@/lib/paths';
import PageConverter from '@/components/shared/sidebar/PageConverter';
import CafeItem from '@/components/shared/sidebar/CafeItem';

export default function SearchCafes() {
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

  const handleSearchCafeClick = useCafeClick<IKakaoSearchResult>({ routePath: 'search' });

  return (
    <div className="h-full flex flex-col">
      <section
        id="search-scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="pagination-sidebar-list">
          {paginatedResult.map((cafe: IKakaoSearchResult) => (
            <CafeItem
              key={cafe.id}
              dataTestId={`cafe-${cafe.id}`}
              name={cafe.place_name}
              address={cafe.road_address_name}
              phone_number={cafe.phone}
              image={IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK}
              onClickAction={() => handleSearchCafeClick(cafe)}
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
          scrollContainerSelector="#search-scroll-container"
        />
      )}
    </div>
  );
}