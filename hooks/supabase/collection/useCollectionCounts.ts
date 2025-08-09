'use client';

import { useQuery } from "@tanstack/react-query";
import { collectionCafeQuery } from "@/queries/supabase/collection";
import { getCollectionCounts } from "@/actions/supabase/collection";

/** 모든 수집 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 수집 카페 수
 */
export function useCollectionCounts(userId: string) {
    const { data, isError, error, isLoading } = useQuery({
        enabled: !!userId,
        queryKey: collectionCafeQuery.counts(userId),
        queryFn: () => getCollectionCounts(userId),
    });

    return { collectionCounts: data, isError, error, isLoading };
}