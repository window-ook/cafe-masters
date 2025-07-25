import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendationCafes } from '@/actions/supabase/recommendation';
import { useCafeStore } from '@/stores';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';

export function useRecommendedCafes() {
  const setRecommendedCafe = useCafeStore(state => state.setRecommendedCafe);

  const { data } = useQuery({
    queryKey: recommendedCafeQuery.all(),
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
