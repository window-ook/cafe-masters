import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  // 다크모드 테마 상태
  isDarkTheme: boolean;
  
  // 서브사이드바 상태 (전역 관리 필요)
  isSubSidebarOpen: boolean;
  
  // 로딩 상태 (전역 관리 필요)
  isLoading: boolean;
  
  // 다크모드 액션
  setIsDarkTheme: () => void;
  
  // 서브사이드바 액션
  setIsSubSidebarOpen: (isOpen: boolean) => void;
  
  // 로딩 액션
  setIsLoading: (isLoading: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      // UI 상태 초기값
      isDarkTheme: false,
      isSubSidebarOpen: false,
      isLoading: false,

      // 다크모드 토글
      setIsDarkTheme: () => set(state => ({ isDarkTheme: !state.isDarkTheme })),
      
      // 서브사이드바 상태 설정
      setIsSubSidebarOpen: isOpen => set({ isSubSidebarOpen: isOpen }),
      
      // 로딩 상태 설정
      setIsLoading: isLoading => set({ isLoading }),
    }),
    {
      name: 'uiStore',
    },
  ),
);