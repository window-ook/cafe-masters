'use client';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/stores/filterStore';
import { bookmarkedCafeQuery } from '@/queries/supabase/bookmark';
import { getBookmarkedCafes } from '@/actions/supabase/bookmark';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';

interface IBookmarkedCafes {
  bookmarkedCafes: ISupabaseBookmarkedCafe[];
  filteredBookmarkedCafes: ISupabaseBookmarkedCafe[];
  paginatedData: ISupabaseBookmarkedCafe[];
  totalPages: number;
  totalFilteredCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** 페이지네이션을 포함한 북마크 카페 조회 훅
 * @param userId 유저 ID
 * @param currentPage 현재 페이지 (1부터 시작)
 * @param itemsPerPage 페이지당 아이템 수
 * @returns 북마크 카페 데이터와 페이지네이션 정보
 */
export function useBookmarkedCafes(
  userId: string,
  currentPage: number = 1,
  itemsPerPage: number = 8
): IBookmarkedCafes & {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { selectedRegion, searchTermInBookmarkedCafe } = useFilterStore();

  const queryData = useQuery({
    enabled: !!userId,
    queryKey: bookmarkedCafeQuery.all(userId),
    queryFn: async () => {
      const response = await getBookmarkedCafes(userId);
      return response;
    },
  });

  // 필터링 및 페이지네이션 계산을 useMemo로 최적화
  const paginationData = useMemo((): IBookmarkedCafes => {
    if (!queryData.data?.data) {
      return {
        bookmarkedCafes: [],
        filteredBookmarkedCafes: [],
        paginatedData: [],
        totalPages: 0,
        totalFilteredCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const bookmarkedCafes = queryData.data.data;

    // 필터링 적용
    const filteredBookmarkedCafes = bookmarkedCafes.filter((cafe: ISupabaseBookmarkedCafe) => {
      const matchesSearch = !searchTermInBookmarkedCafe || cafe.name?.toLowerCase().includes(searchTermInBookmarkedCafe.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || (cafe.address && cafe.address.split(' ')[0] === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    // 페이지네이션 계산
    const totalFilteredCount = filteredBookmarkedCafes.length;
    const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredBookmarkedCafes.slice(startIndex, endIndex);

    // 페이지네이션 상태
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      bookmarkedCafes,
      filteredBookmarkedCafes,
      paginatedData,
      totalPages,
      totalFilteredCount,
      hasNextPage,
      hasPreviousPage,
    };
  }, [
    queryData.data,
    selectedRegion,
    searchTermInBookmarkedCafe,
    currentPage,
    itemsPerPage,
  ]);

  return { ...paginationData, isLoading: queryData.isLoading, isError: queryData.isError, error: queryData.error };
}