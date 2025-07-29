import { useQuery } from "@tanstack/react-query";
import { bookmarkedCafeQuery } from "@/queries/supabase/bookmark";
import { getBookmarkedCafesCounts } from "@/actions/supabase/bookmark";

/** 모든 북마크 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 북마크 카페 수
 */
export function useBookmarkedCafesCounts(userId: string) {
    const { data, isError, error, isLoading } = useQuery({
        enabled: !!userId,
        queryKey: bookmarkedCafeQuery.counts(userId),
        queryFn: () => getBookmarkedCafesCounts(userId),
    });

    return { bookmarkedCounts: data, isError, error, isLoading };
}