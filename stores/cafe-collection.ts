import { create } from 'zustand';

export interface ITargetCafe {
  name: string;
  coordX: number;
  coordY: number;
  address: string;
  image: string;
  extra_images: string[];
  phone_number?: string | null;
  opening_time?: string | null;
}

interface ICafeCollectionStore {
  // 수집 대상 카페 정보
  targetCafe: ITargetCafe | null;

  // 수집 대상 설정
  setTargetCafe: (cafe: ITargetCafe) => void;

  // 수집 대상 초기화
  clearTargetCafe: () => void;
}

export const useCollectedCafeFormForUploadStore = create<ICafeCollectionStore>((set) => ({
  targetCafe: null,

  setTargetCafe: (cafe: ITargetCafe) => set({ targetCafe: cafe }),

  clearTargetCafe: () => set({ targetCafe: null }),
}));