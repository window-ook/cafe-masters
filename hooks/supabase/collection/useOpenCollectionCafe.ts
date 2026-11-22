'use client';

import { useMutation } from '@tanstack/react-query';
import { openCollectionCafe } from '@/actions/supabase/collection';
import { ICoordinates } from '@/utils/shared/geo';

interface IOpenCollectionCafeInput {
    id: number;
    userCoords: ICoordinates;
}

/**
 * 미개봉 카드 개봉 훅
 * @description 위치 조회·캐시 무효화·안내는 PackOpeningProvider가 맡습니다.
 */
export function useOpenCollectionCafe() {
    const openCollection = useMutation({
        mutationFn: ({ id, userCoords }: IOpenCollectionCafeInput) =>
            openCollectionCafe(id, userCoords),
    });

    return { openCollectionCafe: openCollection.mutateAsync };
}
