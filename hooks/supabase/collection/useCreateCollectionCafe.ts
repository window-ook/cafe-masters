'use client';

import { useMutation } from '@tanstack/react-query';
import { CollectionRowInsert, createCollectionCafe } from '@/actions/supabase/collection';
import { ICoordinates } from '@/utils/shared/geo';

interface ICreateCollectionCafeInput {
    cafe: CollectionRowInsert;
    /** 사용자의 현재 좌표. 얻지 못했으면 null이고 미개봉 카드로 저장됩니다 */
    userCoords: ICoordinates | null;
}

/**
 * 수집한 카페 추가 훅
 * @description 위치 조회·캐시 무효화·안내는 PackOpeningProvider가 맡습니다.
 * 연출이 있는 수집은 연출이 끝난 뒤에 화면을 갱신해야 하므로 여기서 무효화하지 않습니다.
 */
export function useCreateCollectionCafe() {
    const createCollection = useMutation({
        mutationFn: ({ cafe, userCoords }: ICreateCollectionCafeInput) =>
            createCollectionCafe(cafe, userCoords),
    });

    return { createCollectionCafe: createCollection.mutateAsync };
}
