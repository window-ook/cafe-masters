import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ICurrentCafeStore {
    // 🚩 카페 상태 플래그
    isCollected: boolean;
    isBookmarked: boolean;
    isRecommended: boolean;

    // 🎯 카페 상태 액션
    setIsCollected: (isCollected: boolean) => void;
    setIsBookmarked: (isBookmarked: boolean) => void;
    setIsRecommended: (isRecommended: boolean) => void;

    // 🔄 상태 초기화 (페이지 이동시 사용)
    resetCafeStates: () => void;
}

export const useCurrentCafeStore = create<ICurrentCafeStore>()(
    persist(
        set => ({
            // 🚩 카페 상태 플래그 초기값
            isCollected: false,
            isBookmarked: false,
            isRecommended: false,

            // 🎯 카페 상태 설정
            setIsCollected: isCollected => set({ isCollected }),
            setIsBookmarked: isBookmarked => set({ isBookmarked }),
            setIsRecommended: isRecommended => set({ isRecommended }),

            // 🔄 모든 카페 상태 초기화
            resetCafeStates: () => set({
                isCollected: false,
                isBookmarked: false,
                isRecommended: false,
            }),
        }),
        {
            name: 'cafeStateStore',
        },
    ),
); 