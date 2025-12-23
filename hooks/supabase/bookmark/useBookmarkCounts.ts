import { getBookmarkCounts } from "@/actions/supabase/bookmark";
import { useQuery } from "@tanstack/react-query";
import { bookmarkCafeQuery } from "@/queries/supabase/bookmark";
import { useUserStore } from "@/stores";

/** 
 * 모든 북마크 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 북마크 카페 수
 */
export function useBookmarkCounts(userId: string) {
    const session = useUserStore(state => state.session);

    const { data, isError, error, isPending, fetchStatus } = useQuery({
        enabled: !!session,
        queryKey: bookmarkCafeQuery.counts(session?.user?.id ?? ''),
        queryFn: () => getBookmarkCounts(),
    });

    return { bookmarkCounts: data, isError, error, isPending: isPending && fetchStatus !== 'idle' };
}