import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ICurrentCafeStore {
  currentCoordX: number;
  currentCoordY: number;
  currentCafeId: number;

  isCollected: boolean;
  isBookmarked: boolean;
  isRecommended: boolean;

  setCurrentCoordX: (x: number) => void;
  setCurrentCoordY: (y: number) => void;
  setIsCollected: (isCollected: boolean) => void;
  setIsBookmarked: (isBookmarked: boolean) => void;
  setIsRecommended: (isRecommended: boolean) => void;
  setCurrentCafeId: (id: number) => void;
}
export const useCurrentCafeStore = create<ICurrentCafeStore>()(

  persist(
    set => ({
      // 기본 좌표 '성수'
      currentCoordX: 127.04663357436208,
      currentCoordY: 37.54715716085294,
      currentCafeId: 12345678,
      isCollected: false,
      isBookmarked: false,
      isRecommended: false,

      setIsCollected: isCollected => set({ isCollected }),
      setIsBookmarked: isBookmarked => set({ isBookmarked }),
      setIsRecommended: isRecommended => set({ isRecommended }),
      setCurrentCoordX: x => set({ currentCoordX: x }),
      setCurrentCoordY: y => set({ currentCoordY: y }),
      setCurrentCafeId: id => set({ currentCafeId: id }),
    }),
    { name: 'mapStore' },
  ),
);