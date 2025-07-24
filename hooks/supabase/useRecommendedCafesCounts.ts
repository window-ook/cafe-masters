import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore } from 'utils/store';
import { countRecommendedCafes } from 'actions/recommendActions';

export function useRecommendedCafesCounts() {
  const setRecommendedCafeCount = useMapStore(
    state => state.setRecommendedCafeCount,
  );

  const countRecommendedCafeQuery = useQuery({
    queryKey: ['recommendedCafeCount'],
    queryFn: async () => {
      const response = await countRecommendedCafes();
      return response || 0;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (countRecommendedCafeQuery.isSuccess)
      setRecommendedCafeCount(countRecommendedCafeQuery.data);
  }, [
    countRecommendedCafeQuery.data,
    countRecommendedCafeQuery.isSuccess,
    setRecommendedCafeCount,
  ]);
}
