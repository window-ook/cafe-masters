import { useQueryClient } from '@tanstack/react-query';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';
import { useMemo } from 'react';

export function useRecommendedCafesCounts() {
  const queryClient = useQueryClient();

  const count = useMemo(() => {
    const cachedData = queryClient.getQueryData(recommendedCafeQuery.all());
    return cachedData;
  }, [queryClient]);

  return { count };
}
