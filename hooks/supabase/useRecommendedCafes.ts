import { useQuery } from '@tanstack/react-query';
import { getRecommendationCafes, getRecommendedCafesCounts } from '@/actions/supabase/recommendation';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';

/**
 * 모든 추천 카페 조회 훅
 * @returns 추천 카페 데이터
 */
export function useRecommendedCafes() {
  const { data } = useQuery({
    queryKey: recommendedCafeQuery.all(),
    queryFn: async () => {
      const response = await getRecommendationCafes();
      return response.data;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  return data;
}

/** 모든 추천 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 추천 카페 수
 */
export function useRecommendedCafesCounts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['recommendedCafesCounts'],
    queryFn: () => getRecommendedCafesCounts(),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  return { recommendedCounts: data, isError, error, isLoading };
}