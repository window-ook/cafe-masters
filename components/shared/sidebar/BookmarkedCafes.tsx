'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { useCafeClickHandler } from '@/hooks/ui/useCafeClickHandler';
import CafeItem from '@/components/shared/sidebar/CafeItem';
import PageConverter from '@/components/shared/sidebar/PageConverter';

const BOOKMARKED_CAFES_PER_PAGE = 8 as const;

export default function BookmarkedCafes() {
  const { isDarkTheme } = useUIStore();
  const { userId } = useUserStore();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    bookmarkedCafes,
    paginatedData: paginatedBookmarkedCafes,
    totalPages,
    totalFilteredCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isError,
    error,
  } = useBookmarkedCafes(userId, currentPage, BOOKMARKED_CAFES_PER_PAGE);

  // 필터링 결과 변경 시 첫 페이지로 이동
  useEffect(() => { setCurrentPage(1); }, [totalFilteredCount]);

  const handleNextBookmarkedCafePage = () => {
    if (hasNextPage) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPageAction = () => {
    if (hasPreviousPage) setCurrentPage(prev => prev - 1);
  };

  const handleBookmarkedCafeClick = useCafeClickHandler<ISupabaseBookmarkedCafe>({
    routePath: 'bookmarked',
    shouldSetCurrentCafeId: true,
  });

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <main className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex flex-col gap-8">
            {Array.from({ length: BOOKMARKED_CAFES_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <main className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-2">
                북마크 목록을 불러오는 중 오류가 발생했습니다.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {error?.message || '알 수 없는 오류'}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // userId가 없는 경우
  if (!userId) {
    return (
      <main className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                로그인이 필요합니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                북마크 목록을 확인하려면 로그인해주세요.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 전체 데이터가 없는 경우 vs 필터링 결과가 없는 경우 구분
  if (bookmarkedCafes?.length === 0) {
    return (
      <main className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                북마크된 카페가 없습니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                관심 있는 카페를 북마크해보세요!
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 필터링 결과만 없는 경우
  if (totalFilteredCount === 0) {
    return (
      <main className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                검색 조건에 맞는 카페가 없습니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                다른 검색어나 필터를 시도해보세요.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative overflow-y-auto overflow-x-hidden">
      {/* 북마크된 카페 리스트 */}
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="my-8 px-8 flex flex-col gap-8">
          {paginatedBookmarkedCafes.map((cafe: ISupabaseBookmarkedCafe) => (
            <CafeItem
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
      <footer className="flex-none">
        <PageConverter
          isDarkTheme={isDarkTheme}
          handlePreviousPageAction={handlePreviousPageAction}
          handleNextPageAction={handleNextBookmarkedCafePage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </footer>
    </main>
  );
}