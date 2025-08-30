'use client';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/stores/filter';
import { getBookmarkCafes } from '@/actions/supabase/bookmark';
import { bookmarkCafeQuery } from '@/queries/supabase/bookmark';
import { ISupabaseBookmarkCafe } from '@/types/supabase/bookmark';

interface IBookmarkCafes {
  bookmarkCafes: ISupabaseBookmarkCafe[];
  filteredBookmarkCafes: ISupabaseBookmarkCafe[];
  paginatedData: ISupabaseBookmarkCafe[];
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
export function useBookmarkCafes(
  userId: string,
  currentPage: number = 1,
  itemsPerPage: number = 8
): IBookmarkCafes & {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { selectedRegion, searchTermInBookmarkCafe } = useFilterStore();

  const queryData = useQuery({
    enabled: !!userId,
    queryKey: bookmarkCafeQuery.all(userId),
    queryFn: async () => {
      const response = await getBookmarkCafes();
      return response;
    },
  });

  // 필터링 및 페이지네이션 계산을 useMemo로 최적화
  const paginationData = useMemo((): IBookmarkCafes => {
    if (!queryData.data?.data) {
      return {
        bookmarkCafes: [],
        filteredBookmarkCafes: [],
        paginatedData: [],
        totalPages: 0,
        totalFilteredCount: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const bookmarkCafes = queryData.data.data;

    // 필터링 적용
    const filteredBookmarkCafes = bookmarkCafes.filter((cafe: ISupabaseBookmarkCafe) => {
      const matchesSearch = !searchTermInBookmarkCafe || cafe.name?.toLowerCase().includes(searchTermInBookmarkCafe.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || (cafe.address && cafe.address.split(' ')[0] === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    // 페이지네이션 계산
    const totalFilteredCount = filteredBookmarkCafes.length;
    const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredBookmarkCafes.slice(startIndex, endIndex);

    // 페이지네이션 상태
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      bookmarkCafes,
      filteredBookmarkCafes,
      paginatedData,
      totalPages,
      totalFilteredCount,
      hasNextPage,
      hasPreviousPage,
    };
  }, [
    queryData.data,
    selectedRegion,
    searchTermInBookmarkCafe,
    currentPage,
    itemsPerPage,
  ]);

  return { ...paginationData, isLoading: queryData.isLoading, isError: queryData.isError, error: queryData.error };
}