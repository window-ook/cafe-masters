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
      keyword: '성수',

      // 사이드바 매핑 데이터
      allCafe: [],
      collectedCafe: [],
      collectedCafeCount: 0,
      bookmarkedCafe: [],

      // 서브 사이드바 매핑 데이터
      thisX: '',
      thisY: '',
      cafeDetail: {},
      collectedCafeDetail: [],
      bookmarkedCafeDetail: [],

      setKeyword: (newKeyword) => set({ keyword: newKeyword }),
      setAllCafe: (newAllCafe) => set({ allCafe: newAllCafe }),
      setCollectedCafe: (newCollectedCafe) =>
        set({ collectedCafe: newCollectedCafe }),
      setCollectedCafeCount: (newCount) =>
        set({ collectedCafeCount: newCount }),
      setBookmarkedCafe: (newBookmarkedCafe) =>
        set({ bookmarkedCafe: newBookmarkedCafe }),
      setThisX: (x) => set({ thisX: x }),
      setThisY: (y) => set({ thisY: y }),
      setCafeDetail: (data) => set({ cafeDetail: data }),
      setCollectedCafeDetail: (data) => set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data) => set({ bookmarkedCafeDetail: data }),
    }),
    {
      name: 'mapStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        keyword: state.keyword,
        thisX: state.thisX,
        thisY: state.thisY,
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
      userId: null,
      userTier: null,
      setUserId: (id) => set({ userId: id }),
      setUserTier: (tier) => set({ userTier: tier }),
    }),
    {
      name: 'userStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        userId: state.userId,
        userTier: state.userTier,
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
