'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectedRowInsert, createCollectedCafe } from '@/actions/supabase/collection';
import { useUserStore } from '@/stores';
import { collectedCafeQuery } from '@/queries/supabase/collection';

/** 수집한 카페 추가 훅 */
export function useCreateCollectedCafe() {
    const queryClient = useQueryClient();
    const { userId } = useUserStore();

    const uploadCollectedCafe = useMutation({
        mutationFn: async (detail: CollectedRowInsert) => await createCollectedCafe(detail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectedCafeQuery.all(userId) });
            queryClient.invalidateQueries({ queryKey: collectedCafeQuery.counts(userId) });
        },
        onError: error => console.error(error),
    });

    return { createCollectedCafe: uploadCollectedCafe.mutate };
}