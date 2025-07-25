import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapStore {
  // 지도 좌표 상태
  currentCoordX: number;
  currentCoordY: number;
  
  // 현재 선택된 카페 정보
  currentCafeId: number;
  currentCafeThumbnail: string;
  
  // 지도 좌표 액션
  setCurrentCoordX: (x: number) => void;
  setCurrentCoordY: (y: number) => void;
  
  // 현재 카페 액션
  setCurrentCafeId: (id: number) => void;
  setCurrentCafeThumbnail: (url: string) => void;
}

export const useMapStore = create<MapStore>()(
  persist(
    set => ({
      // 성수 지역 기본 좌표
      currentCoordX: 127.04663357436208,
      currentCoordY: 37.54715716085294,
      currentCafeId: 12345678,
      currentCafeThumbnail: '',

      setCurrentCoordX: x => set({ currentCoordX: x }),
      setCurrentCoordY: y => set({ currentCoordY: y }),
      setCurrentCafeId: id => set({ currentCafeId: id }),
      setCurrentCafeThumbnail: url => set({ currentCafeThumbnail: url }),
    }),
    {
      name: 'mapStore',
    },
  ),
);