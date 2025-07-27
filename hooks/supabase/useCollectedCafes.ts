'use client';
import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useFilterStore } from 'stores/filter';
import { getCollectedCafes, getCollectedCafesCounts } from '@/actions/supabase/collection';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { collectedCafeQuery } from '@/queries/supabase/collection';

/**
 * 모든 수집 카페 조회 훅
 * @param userId 유저 ID
 * @param isActive 활성화 여부
 * @returns 수집 카페 데이터와 로딩 상태
 */
export function useCollectedCafes(userId: string, isActive: boolean = true) {
  const { selectedRegion, selectedRating, searchTermInCollectedCafe } = useFilterStore();

  const infiniteQuery = useInfiniteQuery({
    enabled: isActive && !!userId,
    queryKey: collectedCafeQuery.all(userId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await getCollectedCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : null;
    },
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치고 필터링 적용
  const { collectedCafes, filteredCollectedCafes } = useMemo(() => {
    if (!infiniteQuery.data) return { collectedCafes: [], filteredCollectedCafes: [] };

    const collectedCafes = infiniteQuery.data.pages.flatMap(page => page.data);

    // 필터링 적용
    const filteredCollectedCafes = collectedCafes.filter((cafe: ISupabaseCollectedCafe) => {
      // 검색어 필터링
      const matchesSearch =
        !searchTermInCollectedCafe ||
        cafe.name
          ?.toLowerCase()
          .includes(searchTermInCollectedCafe.toLowerCase());

      // 지역 필터링
      const matchesRegion =
        selectedRegion === 'all' ||
        (cafe.address && cafe.address.split(' ')[0] === selectedRegion);

      // 별점 필터링
      const matchesRating =
        selectedRating === 'all' || cafe.ratings === selectedRating;

      return matchesSearch && matchesRegion && matchesRating;
    });

    return { collectedCafes, filteredCollectedCafes };
  }, [
    infiniteQuery.data,
    selectedRegion,
    selectedRating,
    searchTermInCollectedCafe,
  ]);

  return { ...infiniteQuery, collectedCafes, filteredCollectedCafes };
}

/** 모든 수집 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 수집 카페 수
 */
export function useCollectedCafesCounts(userId: string) {
  const { data, isError, error, isLoading } = useQuery({
    enabled: !!userId,
    queryKey: collectedCafeQuery.counts(userId),
    queryFn: () => getCollectedCafesCounts(userId),
  });

  return { collectedCounts: data, isError, error, isLoading };
}