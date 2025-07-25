import { useQueryClient } from '@tanstack/react-query';
import { recommendationQuery } from '@/queries/supabase/recommendation';
import { useMemo } from 'react';

export function useRecommendedCafesCounts() {
  const queryClient = useQueryClient();

  const count = useMemo(() => {
    const cachedData = queryClient.getQueryData(recommendationQuery.all());
    return cachedData;
  }, [queryClient]);

  return { count };
}
