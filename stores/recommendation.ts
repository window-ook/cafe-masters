import { create } from 'zustand';

export interface IFormDataForRecommend {
    id: number;
    name: string;
    coordX: number;
    coordY: number;
    address: string;
}

interface IRecommendationStore {
    targetCafeForRecommend: IFormDataForRecommend | null;

    setTargetCafeForRecommend: (cafe: IFormDataForRecommend) => void;
    clearTargetCafe: () => void;
}

export const useRecommendationStore = create<IRecommendationStore>((set) => ({
    targetCafeForRecommend: null,

    setTargetCafeForRecommend: (cafe: IFormDataForRecommend) => set({ targetCafeForRecommend: cafe }),
    clearTargetCafe: () => set({ targetCafeForRecommend: null }),
}));