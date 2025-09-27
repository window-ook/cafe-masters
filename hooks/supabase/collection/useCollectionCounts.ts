'use client';

import { useQuery } from "@tanstack/react-query";
import { collectionCafeQuery } from "@/queries/supabase/collection";
import { getCollectionCounts } from "@/actions/supabase/collection";

/** 모든 수집 카페 수 조회 훅
 * @param userId 유저 ID (쿠리 키용)
 * @returns 수집 카페 수
 */
export function useCollectionCounts(userId: string) {
    const { data, isError, error, isPending } = useQuery({
        enabled: !!userId && userId !== 'no-user',
        queryKey: collectionCafeQuery.counts(userId),
        queryFn: () => getCollectionCounts(),
    });

    return { collectionCounts: data, isError, error, isPending };
}