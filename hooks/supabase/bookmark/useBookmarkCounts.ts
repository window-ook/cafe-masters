import { fetchJson } from "@/utils/shared/fetchJson";
import { INTERNAL_PATHS } from "@/lib/paths";
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
        queryFn: () => fetchJson<number>(INTERNAL_PATHS.API_BOOKMARK_COUNTS),
    });

    return { bookmarkCounts: data, isError, error, isPending: isPending && fetchStatus !== 'idle' };
}