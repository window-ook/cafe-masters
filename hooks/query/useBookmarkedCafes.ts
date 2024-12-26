import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useMapStore } from 'utils/store';
import { getAllBookmarkedCafes } from 'actions/bookmarkActions';

export default function useBookmarkedCafes(userId: string, isActive: boolean) {
  const setBookmarkedCafe = useMapStore(state => state.setBookmarkedCafe);

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
      const allCafes = fetchedBookmarkedCafe.pages.flatMap(page => page.data);
      setBookmarkedCafe(allCafes);
    }
  }, [fetchedBookmarkedCafe, setBookmarkedCafe, isActive]);

  return {
    fetchedBookmarkedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
