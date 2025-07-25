import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendationCafes } from '@/actions/supabase/recommendation';
import { useMapStore } from 'utils/store';
import { recommendationQuery } from '@/queries/supabase/recommendation';

export function useRecommendedCafes() {
  const setRecommendedCafe = useMapStore(state => state.setRecommendedCafe);

  const { data } = useQuery({
    queryKey: recommendationQuery.all(),
    queryFn: async () => {
      const response = await getRecommendationCafes();
      return response.data;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) setRecommendedCafe(data);
  }, [data, setRecommendedCafe]);

  return data;
}
