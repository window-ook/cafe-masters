import { create } from 'zustand';

export interface IFormDataForRecommend {
    id: number;
    name: string;
    coordX: number;
    coordY: number;
    address: string;
    image: string;
    extra_images: string[];
    phone_number?: string | null;
    opening_time?: string | null;
}

interface IRecommendationStore {
    targetCafe: IFormDataForRecommend | null;

    setTargetCafe: (cafe: IFormDataForRecommend) => void;
    clearTargetCafe: () => void;
}

export const useRecommendationStore = create<IRecommendationStore>((set) => ({
    targetCafe: null,

    setTargetCafe: (cafe: IFormDataForRecommend) => set({ targetCafe: cafe }),
    clearTargetCafe: () => set({ targetCafe: null }),
}));