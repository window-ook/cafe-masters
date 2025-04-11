import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMapStore } from 'utils/store';
import { getAllCollectedCafes } from 'actions/collectActions';

export default function useCollectedInfiniteQuery(
  userId: string,
  isActive: boolean,
) {
  const setCollectedCafe = useMapStore(state => state.setCollectedCafe);
  const setFilteredCollectedCafe = useMapStore(
    state => state.setFilteredCollectedCafe,
  );
  const selectedRegion = useMapStore(state => state.selectedRegion);
  const selectedRating = useMapStore(state => state.selectedRating);
  const searchTermInCollectedCafe = useMapStore(
    state => state.searchTermInCollectedCafe,
  );

  const {
    data: fetchedCollectedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    enabled: isActive && !!userId && userId !== 'no-user',
    queryKey: ['collectedCafe', userId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await getAllCollectedCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : null;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isActive && fetchedCollectedCafe) {
      // 모든 페이지의 데이터를 하나의 배열로 합침
      const allCafes = fetchedCollectedCafe.pages.flatMap(page => page.data);
      setCollectedCafe(allCafes);

      // 필터링 적용
      const filteredCafes = allCafes.filter(cafe => {
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
          selectedRating === 'all' || cafe.rating === selectedRating;

        // 모든 조건을 만족하는 카페만 반환
        return matchesSearch && matchesRegion && matchesRating;
      });

      setFilteredCollectedCafe(filteredCafes); // 필터링 된 카페를 저장
    }
  }, [
    isActive,
    fetchedCollectedCafe,
    setCollectedCafe,
    setFilteredCollectedCafe,
    selectedRegion,
    selectedRating,
    searchTermInCollectedCafe,
  ]);

  return {
    fetchedCollectedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
