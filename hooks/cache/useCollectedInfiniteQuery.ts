import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMapStore } from 'utils/store';
import { getAllCollectedCafes } from 'actions/collectActions';

export default function useCollectedInfiniteQuery(
  userId: string,
  isActive: boolean,
) {
  const setCollectedCafe = useMapStore(state => state.setCollectedCafe);

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
      const cafe = fetchedCollectedCafe.pages.flatMap(page => page.data);
      setCollectedCafe(cafe);
    }
  }, [isActive, fetchedCollectedCafe, setCollectedCafe]);

  return {
    fetchedCollectedCafe,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
