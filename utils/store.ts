import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapState {
  keyword: string;
  allCafe: any[];
  collectedCafe: any[];
  bookmarkedCafe: any[];
  setKeyword: (keyword: string) => void;
  setAllCafe: (allCafe: any[]) => void;
}

export const useMapStore = create(
  persist(
    (set) => ({
      keyword: '서울숲',
      allCafe: [], // 모든 카페
      collectedCafe: [], // 수집한 카드들
      collectedCafeCount: 0, // 수집한 카드의 개수
      bookmarkedCafe: [], // 북마크 해 둔 카페들
      cafeDetail: [], // 모든 카페 중 선택한 카페의 상세 정보
      collectedCafeDetail: [], // 수집한 카드 중 선택한 카페의 상세 정보
      bookmarkedCafeDetail: [], // 북마크한 카페 중 선택한 카페의 상세 정보
      setKeyword: (newKeyword) => set({ keyword: newKeyword }),
      setAllCafe: (newAllCafe) => set({ allCafe: newAllCafe }),
      setCollectedCafe: (newCollectedCafe) =>
        set({ collectedCafe: newCollectedCafe }),
      setCollectedCafeCount: (newCount) =>
        set({ collectedCafeCount: newCount }),
      setBookmarkedCafe: (newBookmarkedCafe) =>
        set({ bookmarkedCafe: newBookmarkedCafe }),
      setCafeDetail: (data) => set({ cafeDetail: data }),
      setCollectedCafeDetail: (data) => set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data) => set({ bookmarkedCafeDetail: data }),
    }),
    {
      name: 'mapStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        keyword: state.keyword,
        allCafe: state.allCafe,
        collectedCafe: state.collectedCafe,
        collectedCafeCount: state.collectedCafeCount,
        collectedCafeDetail: state.collectedCafeDetail,
        bookmarkedCafe: state.bookmarkedCafe,
        bookmarkedCafeDetail: state.bookmarkedCafeDetail,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export const useUserStore = create(
  persist(
    (set) => ({
      userId: '',
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: 'userStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        userId: state.userId,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export const useCheckStore = create(
  persist(
    (set) => ({
      // 서브 사이드바 활성화 여부
      isSubSidebarOpen: false,
      setIsSubSidebarOpen: (prev) => set({ isSubSidebarOpen: prev }),

      // 다크 테마 여부
      isDarkTheme: false,
      setIsDarkTheme: () =>
        set((state) => ({ isDarkTheme: !state.isDarkTheme })),

      // 디테일에서 수집, 북마크 여부
      isCollected: false,
      isBookmarked: false,
      setIsCollected: (value) => set({ isCollected: value }),
      setIsBookmarked: (value) => set({ isBookmarked: value }),
    }),
    {
      name: 'checkStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        isSubSidebarOpen: state.isSubSidebarOpen,
        isDarkTheme: state.isDarkTheme,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);
