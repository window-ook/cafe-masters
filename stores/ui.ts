import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCurrentCafeStore } from '@/stores/current-cafe';

interface IUIStore {
  // 다크모드
  isDarkTheme: boolean;

  // 슬라이딩 드로어
  isSlidingDrawerOpen: boolean;

  // ➕ 상세 정보의 메뉴 확장
  isMenuOpen: boolean;

  // 슬라이딩 드로어 활성화
  isExtend: boolean;
  isExtendComplete: boolean;

  // 수집 폼 상태
  isCollectFormOpen: boolean;
  isRecommendFormOpen: boolean;

  // 다크모드 액션
  setIsDarkTheme: () => void;

  // 서브사이드바 액션
  setIsSlidingDrawerOpen: (isOpen: boolean) => void;

  // ➕ 메뉴/확장 관련 액션
  setIsMenuOpen: (isOpen: boolean) => void;
  setIsExtend: () => void;
  setIsExtendComplete: () => void;

  // 수집 폼 액션
  setIsCollectFormOpen: (isOpen: boolean) => void;
  setIsRecommendFormOpen: (isOpen: boolean) => void;

  // 통합 액션
  openCafeDetail: (cafeId: number) => void;
  closeSlidingDrawer: () => void;
}

export const useUIStore = create<IUIStore>()(
  persist(
    set => ({
      isDarkTheme: false,
      isSlidingDrawerOpen: false,

      isMenuOpen: false,
      isExtend: false,
      isExtendComplete: false,
      isCollectFormOpen: false,
      isRecommendFormOpen: false,

      setIsDarkTheme: () => set(state => ({ isDarkTheme: !state.isDarkTheme })),

      setIsSlidingDrawerOpen: isOpen => set({ isSlidingDrawerOpen: isOpen }),

      setIsMenuOpen: isOpen => set({ isMenuOpen: isOpen }),
      setIsExtend: () => set(state => ({ isExtend: !state.isExtend })),
      setIsExtendComplete: () => set(state => ({ isExtendComplete: !state.isExtendComplete })),

      setIsCollectFormOpen: isOpen => set({ isCollectFormOpen: isOpen }),
      setIsRecommendFormOpen: isOpen => set({ isRecommendFormOpen: isOpen }),

      // 통합 액션 구현
      openCafeDetail: (cafeId: number) => {
        useCurrentCafeStore.getState().setCurrentCafeId(cafeId);
        set({
          isSlidingDrawerOpen: true,
          isCollectFormOpen: false,
          isRecommendFormOpen: false
        });
      },

      closeSlidingDrawer: () => {
        set({ isSlidingDrawerOpen: false });
        useCurrentCafeStore.getState().setCurrentCafeId(12345678);
      },
    }),
    { name: 'UIStore' },
  ),
);