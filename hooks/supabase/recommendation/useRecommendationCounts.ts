import { useQuery } from '@tanstack/react-query';
import { recommendationCafeQuery } from '@/queries/supabase/recommendation';
import { getRecommendationCounts } from '@/actions/supabase/recommendation';

/** 모든 추천 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 추천 카페 수
 */
export function useRecommendationCounts() {
    const { data, isError, error, isPending } = useQuery({
        queryKey: recommendationCafeQuery.counts(),
        queryFn: () => getRecommendationCounts(),
    });

    return { recommendationCounts: data, isError, error, isPending };
}