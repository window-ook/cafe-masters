'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionRowInsert, createCollectionCafe } from '@/actions/supabase/collection';
import { useUserStore } from '@/stores';
import { collectionCafeQuery } from '@/queries/supabase/collection';

/** 수집한 카페 추가 훅 */
export function useCreateCollectionCafe() {
    const queryClient = useQueryClient();
    const { userId } = useUserStore();

    const uploadCollectionCafe = useMutation({
        mutationFn: async (detail: CollectionRowInsert) => await createCollectionCafe(detail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: collectionCafeQuery.all(userId) });
            queryClient.invalidateQueries({ queryKey: collectionCafeQuery.counts(userId) });
        },
        onError: error => console.error(error),
    });

    return { createCollectionCafe: uploadCollectionCafe.mutateAsync };
}