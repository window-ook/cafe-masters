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
      bookmarkedCafe: [],
      cafeDetail: null,
      setKeyword: (newKeyword) => set({ keyword: newKeyword }),
      setAllCafe: (newAllCafe) => set({ allCafe: newAllCafe }),
      setCollectedCafe: (newCollectedCafe) =>
        set({ collectedCafe: newCollectedCafe }),
      setBookmarkedCafe: (newBookmarkedCafe) =>
        set({ bookmarkedCafe: newBookmarkedCafe }),
      setCafeDetail: (data) => set({ cafeDetail: data }),
    }),
    {
      name: 'mapStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        keyword: state.keyword,
        allCafe: state.allCafe,
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
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);
