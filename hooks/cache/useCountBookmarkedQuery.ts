import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore } from 'utils/store';
import { countBookmarkedCafes } from 'actions/bookmarkActions';

export default function useCountBookmarkedQuery(userId: string) {
  const setBookmarkedCafeCount = useMapStore(
    state => state.setBookmarkedCafeCount,
  );

  const countBookmarkedCafeQuery = useQuery({
    queryKey: ['bookmarkedCafeCount', userId],
    queryFn: async () => {
      const response = await countBookmarkedCafes(userId);
      return response || 0;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (countBookmarkedCafeQuery.isSuccess)
      setBookmarkedCafeCount(countBookmarkedCafeQuery.data);
  }, [
    countBookmarkedCafeQuery.data,
    countBookmarkedCafeQuery.isSuccess,
    setBookmarkedCafeCount,
  ]);
}
