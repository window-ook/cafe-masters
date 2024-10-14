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
      allCafe: [],
      collectedCafe: [],
      collectedCafeCount: 0,
      bookmarkedCafe: [],
      cafeDetail: null,
      collectedDetail: null,
      setKeyword: (newKeyword) => set({ keyword: newKeyword }),
      setAllCafe: (newAllCafe) => set({ allCafe: newAllCafe }),
      setCollectedCafe: (newCollectedCafe) =>
        set({ collectedCafe: newCollectedCafe }),
      setCollectedCafeCount: (newCount) =>
        set({ collectedCafeCount: newCount }),
      setBookmarkedCafe: (newBookmarkedCafe) =>
        set({ bookmarkedCafe: newBookmarkedCafe }),
      setCafeDetail: (data) => set({ cafeDetail: data }),
      setCollectedDetail: (data) => set({ collectedDetail: data }),
    }),
    {
      name: 'mapStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        keyword: state.keyword,
        allCafe: state.allCafe,
        collectedCafe: state.collectedCafe,
        collectedCafeCount: state.collectedCafeCount,
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
      isSubSidebarOpen: false,
      setIsSubSidebarOpen: (prev) => set({ isSubSidebarOpen: prev }),

      isDarkTheme: false,
      setIsDarkTheme: () =>
        set((state) => ({ isDarkTheme: !state.isDarkTheme })),

      // 디테일에서 수집, 북마크 여부 표시
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
