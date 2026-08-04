'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { CollectionRowInsert, createCollectionCafe } from '@/actions/supabase/collection';
import { useUserStore } from '@/stores';
import { collectionCafeQuery } from '@/queries/supabase/collection';
import { CONSOLE_ERROR, TOAST_ERROR } from '@/utils/constants/messages';
import { getCurrentCoordinates } from '@/utils/shared/geolocation';

/**
 * 수집한 카페 추가 훅
 * @description 수집을 시도하는 시점에 위치를 조회합니다.
 * 위치를 얻으면 서버가 재질을 확정하고, 얻지 못하면 미개봉 상태로 저장됩니다.
 */
export function useCreateCollectionCafe() {
    const queryClient = useQueryClient();
    const { userId } = useUserStore();

    const uploadCollectionCafe = useMutation({
        mutationFn: async (detail: CollectionRowInsert) => {
            const userCoords = await getCurrentCoordinates();

            return await createCollectionCafe(detail, userCoords);
        },
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