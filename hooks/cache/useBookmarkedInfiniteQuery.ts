import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMapStore } from 'utils/store';
import { getAllBookmarkedCafes } from 'actions/bookmarkActions';

export default function useBookmarkedInfiniteQuery(
  userId: string,
  isActive: boolean,
) {
  const setBookmarkedCafe = useMapStore(state => state.setBookmarkedCafe);
  const setFilteredBookmarkedCafe = useMapStore(
    state => state.setFilteredBookmarkedCafe,
  );
  const selectedRegion = useMapStore(state => state.selectedRegion);
  const searchTermInBookmarkedCafe = useMapStore(
    state => state.searchTermInBookmarkedCafe,
  );

  const {
    data: fetchedBookmarkedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    enabled: !!userId && userId !== 'no-user',
    initialPageParam: 0,
    queryKey: ['bookmarkedCafe', userId],
    queryFn: async ({ pageParam }) => {
      const response = await getAllBookmarkedCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : null;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isActive && fetchedBookmarkedCafe) {
      // 모든 페이지의 데이터를 하나의 배열로 합침
      const allCafes = fetchedBookmarkedCafe.pages.flatMap(page => page.data);
      setBookmarkedCafe(allCafes);

      // 필터링 적용
      const filteredCafes = allCafes.filter(cafe => {
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

        // 모든 조건을 만족하는 카페만 반환
        return matchesSearch && matchesRegion;
      });

      setFilteredBookmarkedCafe(filteredCafes); // 필터링 된 카페를 저장
    }
  }, [
    isActive,
    fetchedBookmarkedCafe,
    setBookmarkedCafe,
    setFilteredBookmarkedCafe,
    selectedRegion,
    searchTermInBookmarkedCafe,
  ]);

  return {
    fetchedBookmarkedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
