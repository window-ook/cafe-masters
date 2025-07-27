import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  // 다크모드 액션
  setIsDarkTheme: () => void;

  // 서브사이드바 액션
  setIsSlidingDrawerOpen: (isOpen: boolean) => void;

  // ➕ 메뉴/확장 관련 액션
  setIsMenuOpen: (isOpen: boolean) => void;
  setIsExtend: () => void;
  setIsExtendComplete: () => void;
}

export const useUIStore = create<IUIStore>()(
  persist(
    set => ({
      isDarkTheme: false,
      isSlidingDrawerOpen: false,

      isMenuOpen: false,
      isExtend: false,
      isExtendComplete: false,

      setIsDarkTheme: () => set(state => ({ isDarkTheme: !state.isDarkTheme })),

      setIsSlidingDrawerOpen: isOpen => set({ isSlidingDrawerOpen: isOpen }),

      setIsMenuOpen: isOpen => set({ isMenuOpen: isOpen }),
      setIsExtend: () => set(state => ({ isExtend: !state.isExtend })),
      setIsExtendComplete: () => set(state => ({ isExtendComplete: !state.isExtendComplete })),
    }),
    { name: 'UIStore' },
  ),
);