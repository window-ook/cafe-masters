'use client';

import { useQuery } from "@tanstack/react-query";
import { collectionCafeQuery } from "@/queries/supabase/collection";
import { fetchJson } from "@/utils/shared/fetchJson";
import { INTERNAL_PATHS } from "@/lib/paths";
import { useUserStore } from "@/stores";

/** 모든 수집 카페 수 조회 훅
 * @param userId 유저 ID (쿠리 키용)
 * @returns 수집 카페 수
 */
export function useCollectionCounts(userId: string) {
    const session = useUserStore(state => state.session);

    const { data, isError, error, isPending, fetchStatus } = useQuery({
        enabled: !!session,
        queryKey: collectionCafeQuery.counts(session?.user?.id ?? ''),
        queryFn: () => fetchJson<number>(INTERNAL_PATHS.API_COLLECTION_COUNTS),
    });

    return { collectionCounts: data, isError, error, isPending: isPending && fetchStatus !== 'idle' };
}