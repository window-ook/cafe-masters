'use client';

import React, { useState, useEffect } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import CollectionCafe from '@/components/collection/CollectionCafe';
import PageConverter from '@/components/shared/sidebar/PageConverter';

const COLLECTION_CAFES_PER_PAGE = 8 as const;

export default function CollectionCafes() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const userId = useUserStore(state => state.userId);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    collectionCafes,
    paginatedData: paginatedCollectionCafes,
    totalPages,
    totalFilteredCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isError,
    error,
  } = useCollectionCafes(userId, currentPage, COLLECTION_CAFES_PER_PAGE, true);

  useEffect(() => { setCurrentPage(1); }, [totalFilteredCount]);

  const handleNextCollectionCafePage = () => { if (hasNextPage) setCurrentPage(prev => prev + 1); };;
  const handlePreviousPageAction = () => { if (hasPreviousPage) setCurrentPage(prev => prev - 1); };;
  const handleCollectionCafeClick = useCafeClick<ISupabaseCollectionCafe>({ routePath: 'collection' });

  if (isLoading) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex flex-col gap-8">
            {Array.from({ length: COLLECTION_CAFES_PER_PAGE }).map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-2">
                수집 카페 목록을 불러오는 중 오류가 발생했습니다.
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

  if (!userId) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                로그인이 필요합니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                수집한 카페를 확인하려면 로그인해주세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 전체 데이터가 없는 경우
  if (collectionCafes?.length === 0) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <section className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="my-8 px-8 flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                수집한 카페가 없습니다.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                카페를 방문하여 수집해보세요!
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
      <div className="relative overflow-y-auto overflow-x-hidden">
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
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <section
        id="collection-scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="pagination-sidebar-list">
          {paginatedCollectionCafes.map((cafe: ISupabaseCollectionCafe) => (
            <CollectionCafe
              key={cafe.id}
              name={cafe.name}
              ratings={cafe.ratings!}
              image={cafe.image}
              address={cafe.address}
              phone_number={cafe.phone_number!}
              onClickAction={() => handleCollectionCafeClick(cafe)}
            />
          ))}
        </ul>
      </section>

      <PageConverter
        isDarkTheme={isDarkTheme}
        handlePreviousPageAction={handlePreviousPageAction}
        handleNextPageAction={handleNextCollectionCafePage}
        currentPage={currentPage}
        totalPages={totalPages}
        scrollContainerSelector="#collection-scroll-container"
      />
    </div>
  );
}