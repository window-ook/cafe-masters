import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllRecommendedCafes } from 'actions/recommendsActions';
import { useMapStore } from 'utils/store';

export default function useRecommendedQuery() {
  const setRecommendedCafe = useMapStore(state => state.setRecommendedCafe);

  const { data } = useQuery({
    queryKey: ['recommendedCafe'],
    queryFn: async () => {
      const response = await getAllRecommendedCafes();
      return response;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) setRecommendedCafe(data);
  }, [data, setRecommendedCafe]);

  return data;
}
