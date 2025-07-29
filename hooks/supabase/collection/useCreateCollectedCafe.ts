'use client';

import { useUIStore } from "@/stores";
import { useCollectionStore, IFormDataForCollect } from "@/stores/collectionStore";

/**
 * 수집할 카페의 데이터를 상태로 동기화하는 커스텀 훅
 * @description 3개의 상세 페이지에서 공통으로 사용되는 수집하기 버튼 로직을 제공합니다.
 */
export function useCreateCollectedCafe() {
    const { setTargetCafe, clearTargetCafe } = useCollectionStore();
    const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);

    const selectTargetCafeForCollect = (cafeData: IFormDataForCollect) => {
        setTargetCafe(cafeData);
        setIsCollectFormOpen(true);
    };

    const clearTargetCafeForCollect = () => {
        clearTargetCafe();
        setIsCollectFormOpen(false);
    };

    return {
        selectTargetCafeForCollect,
        clearTargetCafeForCollect,
    };
}