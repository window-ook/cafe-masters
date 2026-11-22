import { useQuery } from '@tanstack/react-query';
import { recommendationCafeQuery } from '@/queries/supabase/recommendation';
import { fetchJson } from '@/utils/shared/fetchJson';
import { INTERNAL_PATHS } from '@/lib/paths';

/** 모든 추천 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 추천 카페 수
 */
export function useRecommendationCounts() {
    const { data, isError, error, isPending } = useQuery({
        queryKey: recommendationCafeQuery.counts(),
        queryFn: () => fetchJson<number>(INTERNAL_PATHS.API_RECOMMENDATION_COUNTS),
    });

    return { recommendationCounts: data, isError, error, isPending };
}