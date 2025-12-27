'use client';

import { useState } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { useBookmarkCafes } from '@/hooks/supabase/bookmark/useBookmarkCafes';
import { ISupabaseBookmarkCafe } from '@/types/supabase/bookmark';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import CafeItem from '@/components/shared/sidebar/CafeItem';
import PageConverter from '@/components/shared/sidebar/PageConverter';

const BOOKMARK_CAFES_PER_PAGE = 8 as const;

export default function BookmarkCafes() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const session = useUserStore(state => state.session);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    bookmarkCafes,
    paginatedData: paginatedBookmarkCafes,
    totalPages,
    totalFilteredCount,
    hasNextPage,
    hasPreviousPage,
    isPending,
    isError,
    error,
  } = useBookmarkCafes(
    session?.user?.id ?? '',
    currentPage,
    BOOKMARK_CAFES_PER_PAGE,
  );

  const [prevTotalFilteredCount, setPrevTotalFilteredCount] =
    useState(totalFilteredCount);

  if (totalFilteredCount !== prevTotalFilteredCount) {
    setPrevTotalFilteredCount(totalFilteredCount);
    setCurrentPage(1);
  }

  const handleNextBookmarkCafePage = () => {
    if (hasNextPage) setCurrentPage(prev => prev + 1);
  };
  const handlePreviousPageAction = () => {
    if (hasPreviousPage) setCurrentPage(prev => prev - 1);
  };
  const handleBookmarkCafeClick = useCafeClick<ISupabaseBookmarkCafe>({
    routePath: 'bookmark',
  });

  if (isPending) {
    return (
      <div className="relative overflow-x-hidden overflow-y-auto">
        <section className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="my-8 flex flex-col gap-8 px-8">
            {Array.from({ length: BOOKMARK_CAFES_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative overflow-x-hidden overflow-y-auto">
        <section className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="my-8 flex h-40 items-center justify-center px-8">
            <div className="text-center">
              <p className="mb-2 text-red-500 dark:text-red-400">
                북마크 목록을 불러오는 중 에러가 발생했습니다.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error?.message || '알 수 없는 오류'}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative overflow-x-hidden overflow-y-auto">
        <section className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="my-8 flex h-40 items-center justify-center px-8">
            <div className="text-center">
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                로그인이 필요합니다.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                북마크 목록을 확인하려면 로그인해주세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 전체 데이터가 없는 경우
  if (bookmarkCafes?.length === 0) {
    return (
      <div className="relative overflow-x-hidden overflow-y-auto">
        <section className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="my-8 flex h-40 items-center justify-center px-8">
            <div className="text-center">
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                북마크된 카페가 없습니다.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                관심 있는 카페를 북마크해보세요!
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 필터링 결과가 없는 경우
  if (totalFilteredCount === 0) {
    return (
      <div className="relative overflow-x-hidden overflow-y-auto">
        <section className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="my-8 flex h-40 items-center justify-center px-8">
            <div className="text-center">
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                검색 조건에 맞는 카페가 없습니다.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                다른 검색어나 필터를 시도해보세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <section
        id="bookmark-scroll-container"
        className="flex-1 overflow-x-hidden overflow-y-auto"
      >
        <ul className="pagination-sidebar-list">
          {paginatedBookmarkCafes.map((cafe: ISupabaseBookmarkCafe) => (
            <CafeItem
              key={cafe.id}
              dataTestId={`cafe-${cafe.id}`}
              name={cafe.name}
              address={cafe.address}
              phone_number={cafe.phone_number}
              image={cafe.image}
              onClickAction={() => handleBookmarkCafeClick(cafe)}
            />
          ))}
        </ul>
      </section>

      <PageConverter
        isDarkTheme={isDarkTheme}
        handlePreviousPageAction={handlePreviousPageAction}
        handleNextPageAction={handleNextBookmarkCafePage}
        currentPage={currentPage}
        totalPages={totalPages}
        scrollContainerSelector="#bookmark-scroll-container"
      />
    </div>
  );
}
