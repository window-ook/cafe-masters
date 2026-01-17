'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CollectionRowInsert, createCollectionCafe } from '@/actions/supabase/collection';
import { useUserStore } from '@/stores';
import { collectionCafeQuery } from '@/queries/supabase/collection';
import { CONSOLE_ERROR, TOAST_ERROR } from '@/utils/constants/messages';

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
        onError: error => {
            console.error(CONSOLE_ERROR.CREATE_COLLECTION_CAFE, error);
            toast.error(TOAST_ERROR.CREATE_COLLECTION);
        },
    });

    return { createCollectionCafe: uploadCollectionCafe.mutateAsync };
}