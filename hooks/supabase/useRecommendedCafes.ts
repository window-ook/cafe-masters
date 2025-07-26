import { useQuery } from '@tanstack/react-query';
import { getRecommendedCafes, getRecommendedCafesCounts } from '@/actions/supabase/recommendation';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';

/**
 * 모든 추천 카페 조회 훅
 * @returns 추천 카페 데이터와 로딩 상태
 */
export function useRecommendedCafes() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: recommendedCafeQuery.all(),
    queryFn: async () => {
      const response = await getRecommendedCafes();
      return response.data;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  return { recommendedCafes: data || [], isError, error, isLoading };
}

/** 모든 추천 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 추천 카페 수
 */
export function useRecommendedCafesCounts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: recommendedCafeQuery.counts(),
    queryFn: () => getRecommendedCafesCounts(),
  });

  return { recommendedCounts: data, isError, error, isLoading };
}