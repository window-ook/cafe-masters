import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore } from 'utils/store';
import { countCollectedCafes } from 'actions/collectActions';

export default function useCountCollectedQuery(userId: string) {
  const setCollectedCafeCount = useMapStore(
    state => state.setCollectedCafeCount,
  );

  const countCollectedCafeQuery = useQuery({
    queryKey: ['collectedCafeCount', userId],
    queryFn: async () => {
      const response = await countCollectedCafes(userId);
      return response || 0;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (countCollectedCafeQuery.isSuccess)
      setCollectedCafeCount(countCollectedCafeQuery.data);
  }, [
    countCollectedCafeQuery.data,
    countCollectedCafeQuery.isSuccess,
    setCollectedCafeCount,
  ]);
}
