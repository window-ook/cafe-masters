'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore } from 'stores';
import { useFilterStore } from '@/stores/filter';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';
import { ISupabaseRecommendationCafe } from '@/types/supabase/recommendation';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import CafeItem from '@/components/shared/sidebar/CafeItem';
import PageConverter from '@/components/shared/sidebar/PageConverter';

export default function RecommendationCafes() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const selectedCategories = useFilterStore(state => state.selectedCategories);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { filteredRecommendationCafes, totalFilteredCount, isError, error, isPending } = useRecommendationCafes(selectedCategories);

  const recommendationPerPage = 5;
  const totalRecommendedPages = Math.ceil((filteredRecommendationCafes?.length || 0) / recommendationPerPage);
  const paginatedRecommend = filteredRecommendationCafes?.slice((currentPage - 1) * recommendationPerPage, currentPage * recommendationPerPage) || [];

  useEffect(() => { setCurrentPage(1); }, [filteredRecommendationCafes]);

  const handleNextRecommendedPage = () => {
    if (currentPage < totalRecommendedPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRecommendedCafeClick = useCafeClick<ISupabaseRecommendationCafe>({ routePath: 'recommendation' });

  // 로딩 상태 처리
  if (isPending) {
    return (
      <div className="h-full flex flex-col">
        <section
          id="recommendation-scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden">
          <ul className="pagination-sidebar-list">
            {Array.from({ length: recommendationPerPage }).map((_, index) => (
              <li
                key={index}
                className={`h-24 p-2 rounded-sm shadow-md list-none ${isDarkTheme ? 'bg-dark-background text-white shadow-dark-shadow' : ''} hover:opacity-50 transition duration-150 ease`}
              >
                <button
                  type="button"
                  aria-label="카페 상세 정보 열기 버튼"
                  className="w-full h-full flex justify-between items-center gap-2 text-left cursor-pointer"
                >
                  <div className="h-full flex flex-col justify-center gap-1">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis  font-bold text-xl">
                      로딩중..
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="h-full flex flex-col">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-2">
                추천 카페 목록을 불러오는 중 에러가 발생했습니다.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {error?.message || '알 수 없는 오류'}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 전체 데이터가 없는 경우 vs 필터링 결과가 없는 경우 구분
  if (filteredRecommendationCafes?.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                추천 카페가 없습니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                곧 새로운 추천 카페가 추가될 예정입니다!
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 필터링 결과만 없는 경우
  if (totalFilteredCount === 0) {
    return (
      <div className="h-full flex flex-col">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                검색 조건에 맞는 카페가 없습니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                다른 카테고리를 선택해보세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <section
        id="recommendation-scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="pagination-sidebar-list">
          {paginatedRecommend.map((cafe: ISupabaseRecommendationCafe) => (
            <CafeItem
              key={cafe.id}
              dataTestId={`cafe-${cafe.id}`}
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
          scrollContainerSelector="#recommendation-scroll-container"
        />
      )}
    </div>
  );
}