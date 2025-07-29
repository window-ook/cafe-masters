'use client';

import { useQuery } from "@tanstack/react-query";
import { collectedCafeQuery } from "@/queries/supabase/collection";
import { getCollectedCafesCounts } from "@/actions/supabase/collection";

/** 모든 수집 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 수집 카페 수
 */
export function useCollectedCafesCounts(userId: string) {
    const { data, isError, error, isLoading } = useQuery({
        enabled: !!userId,
        queryKey: collectedCafeQuery.counts(userId),
        queryFn: () => getCollectedCafesCounts(userId),
    });

    return { collectedCounts: data, isError, error, isLoading };
}