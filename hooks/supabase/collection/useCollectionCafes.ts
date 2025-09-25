'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/stores/filter';
import { getAllCollectionCafes } from '@/actions/supabase/collection';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
import { collectionCafeQuery } from '@/queries/supabase/collection';
import { MOCK_COLLECTION_CAFES } from '@/tests/e2e/utils/constants';

interface ICollectionCafes {
  collectionCafes: ISupabaseCollectionCafe[];
  filteredCollectionCafes: ISupabaseCollectionCafe[];
  paginatedData: ISupabaseCollectionCafe[];
  totalPages: number;
  totalFilteredCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * 페이지네이션을 포함한 수집 카페 조회 훅
 * @param userId 유저 ID
 * @param currentPage 현재 페이지 (1부터 시작)
 * @param itemsPerPage 페이지당 아이템 수
 * @param isActive 활성화 여부
 * @returns 수집 카페 데이터와 페이지네이션 정보
 */
export function useCollectionCafes(
  userId: string,
  currentPage: number = 1,
  itemsPerPage: number = 8,
  isActive: boolean = true
): ICollectionCafes & {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { selectedRegion, selectedRating, searchTermInCollectionCafe } = useFilterStore();

  const queryData = useQuery({
    enabled: isActive && !!userId,
    queryKey: collectionCafeQuery.all(userId),
    queryFn: async () => {
      const isPlaywrightTest = typeof window !== 'undefined' &&
        (window.navigator.userAgent.includes('Playwright') || (window as any).__PLAYWRIGHT_TEST__ === true);

      if (isPlaywrightTest) return { data: MOCK_COLLECTION_CAFES };

      const response = await getAllCollectionCafes();
      return response;
    },
  });

  const paginationData = useMemo((): ICollectionCafes => {
    if (!queryData.data?.data) {
      return {
        collectionCafes: [],
        filteredCollectionCafes: [],
        paginatedData: [],
        totalPages: 0,
        totalFilteredCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const collectionCafes = queryData.data.data;

    const filteredCollectionCafes = collectionCafes.filter((cafe: ISupabaseCollectionCafe) => {
      // 검색어 필터링
      const matchesSearch =
        !searchTermInCollectionCafe ||
        cafe.name?.toLowerCase().includes(searchTermInCollectionCafe.toLowerCase());

      // 지역 필터링
      const matchesRegion =
        selectedRegion === 'all' ||
        (cafe.address && cafe.address.split(' ')[0] === selectedRegion);

      // 별점 필터링
      const matchesRating =
        selectedRating === 'all' || cafe.ratings === selectedRating;

      return matchesSearch && matchesRegion && matchesRating;
    });

    // 페이지네이션 계산
    const totalFilteredCount = filteredCollectionCafes.length;
    const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredCollectionCafes.slice(startIndex, endIndex);

    // 페이지네이션 상태
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      collectionCafes,
      filteredCollectionCafes,
      paginatedData,
      totalPages,
      totalFilteredCount,
      hasNextPage,
      hasPreviousPage,
    };
  }, [
    queryData.data,
    selectedRegion,
    selectedRating,
    searchTermInCollectionCafe,
    currentPage,
    itemsPerPage,
  ]);

  return {
    ...paginationData,
    isLoading: queryData.isLoading,
    isError: queryData.isError,
    error: queryData.error
  };
}