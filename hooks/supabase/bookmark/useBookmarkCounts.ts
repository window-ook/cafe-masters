import { getBookmarkCounts } from "@/actions/supabase/bookmark";
import { useQuery } from "@tanstack/react-query";
import { bookmarkCafeQuery } from "@/queries/supabase/bookmark";

/** 모든 북마크 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 북마크 카페 수
 */
export function useBookmarkCounts(userId: string) {
    const { data, isError, error, isLoading } = useQuery({
        enabled: !!userId,
        queryKey: bookmarkCafeQuery.counts(userId),
        queryFn: () => getBookmarkCounts(userId),
    });

    return { bookmarkCounts: data, isError, error, isLoading };
}