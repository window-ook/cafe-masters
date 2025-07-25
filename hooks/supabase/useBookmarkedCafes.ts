'use client';
import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useFilterStore } from 'stores/filter';
import { getBookmarkedCafes } from '@/actions/supabase/bookmark';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';

export function useBookmarkedCafes(userId: string, isActive: boolean = true) {
  const selectedRegion = useFilterStore(state => state.selectedRegion);
  const searchTermInBookmarkedCafe = useFilterStore(
    state => state.searchTermInBookmarkedCafe,
  );

  const infiniteQuery = useInfiniteQuery({
    enabled: !!userId && userId !== 'no-user' && isActive,
    initialPageParam: 0,
    queryKey: ['bookmarkedCafe', userId],
    queryFn: async ({ pageParam }) => {
      const response = await getBookmarkedCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : null;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치고 필터링 적용
  const { allCafes, filteredCafes } = useMemo(() => {
    if (!infiniteQuery.data) {
      return { allCafes: [], filteredCafes: [] };
    }

    const allCafes = infiniteQuery.data.pages.flatMap(page => page.data);
    
    // 필터링 적용
    const filteredCafes = allCafes.filter((cafe: ISupabaseBookmarkedCafe) => {
      // 검색어 필터링
      const matchesSearch =
        !searchTermInBookmarkedCafe ||
        cafe.name
          ?.toLowerCase()
          .includes(searchTermInBookmarkedCafe.toLowerCase());

      // 지역 필터링
      const matchesRegion =
        selectedRegion === 'all' ||
        (cafe.address && cafe.address.split(' ')[0] === selectedRegion);

      return matchesSearch && matchesRegion;
    });

    return { allCafes, filteredCafes };
  }, [infiniteQuery.data, selectedRegion, searchTermInBookmarkedCafe]);

  return {
    ...infiniteQuery,
    data: allCafes,
    filteredData: filteredCafes,
  };
}
