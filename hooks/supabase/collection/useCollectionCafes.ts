'use client';

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/stores/filter';
import { getCollectionCafes } from '@/actions/supabase/collection';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
import { collectionCafeQuery } from '@/queries/supabase/collection';

/**
 * 모든 수집 카페 조회 훅
 * @param userId 유저 ID
 * @param isActive 활성화 여부
 * @returns 수집 카페 데이터와 로딩 상태
 */
export function useCollectionCafes(userId: string, isActive: boolean = true) {
  const { selectedRegion, selectedRating, searchTermInCollectionCafe } = useFilterStore();

  const infiniteQuery = useInfiniteQuery({
    enabled: isActive && !!userId,
    queryKey: collectionCafeQuery.all(userId),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await getCollectionCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : null;
    },
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치고 필터링 적용
  const { collectionCafes, filteredCollectionCafes } = useMemo(() => {
    if (!infiniteQuery.data) return { collectionCafes: [], filteredCollectionCafes: [] };

    const collectionCafes = infiniteQuery.data.pages.flatMap(page => page.data);

    // 필터링 적용
    const filteredCollectionCafes = collectionCafes.filter((cafe: ISupabaseCollectionCafe) => {
      // 검색어 필터링
      const matchesSearch =
        !searchTermInCollectionCafe ||
        cafe.name
          ?.toLowerCase()
          .includes(searchTermInCollectionCafe.toLowerCase());

      // 지역 필터링
      const matchesRegion =
        selectedRegion === 'all' ||
        (cafe.address && cafe.address.split(' ')[0] === selectedRegion);

      // 별점 필터링
      const matchesRating =
        selectedRating === 'all' || cafe.ratings === selectedRating;

      return matchesSearch && matchesRegion && matchesRating;
    });

    return { collectionCafes, filteredCollectionCafes };
  }, [
    infiniteQuery.data,
    selectedRegion,
    selectedRating,
    searchTermInCollectionCafe,
  ]);

  return { ...infiniteQuery, collectionCafes, filteredCollectionCafes };
}