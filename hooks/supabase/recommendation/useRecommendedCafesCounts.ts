import { useQuery } from '@tanstack/react-query';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';
import { getRecommendedCafesCounts } from '@/actions/supabase/recommendation';

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