import { BookmarkedCafe, CollectedCafe } from 'types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMapStore = create(
  persist(
    (set) => ({
      keyword: '성수',
      allCafe: [],
      collectedCafe: [],
      collectedCafeCount: 0,
      bookmarkedCafe: [],
      thisX: '',
      thisY: '',
      cafeDetail: {},
      collectedCafeDetail: [],
      bookmarkedCafeDetail: [],

      setKeyword: (data: string) => set({ keyword: data }),
      setAllCafe: (data: any[]) => set({ allCafe: data ?? [] }),
      setCollectedCafe: (data: CollectedCafe[]) =>
        set({ collectedCafe: data ?? [] }),
      setCollectedCafeCount: (data: number) =>
        set({ collectedCafeCount: data }),
      setBookmarkedCafe: (data: BookmarkedCafe[]) =>
        set({ bookmarkedCafe: data ?? [] }),
      setThisX: (x: string) => set({ thisX: x }),
      setThisY: (y: string) => set({ thisY: y }),
      setCafeDetail: (data: object) => set({ cafeDetail: data }),
      setCollectedCafeDetail: (data: CollectedCafe[]) =>
        set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data: BookmarkedCafe[]) =>
        set({ bookmarkedCafeDetail: data }),
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
      userId: 'userId',
      userTier: 'BEGINNER',
      setUserId: (user: string) => set({ userId: user }),
      setUserTier: (tier: string) => set({ userTier: tier }),
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
      isSubSidebarOpen: false,
      setIsSubSidebarOpen: (prev: boolean) => set({ isSubSidebarOpen: prev }),

      isDarkTheme: false,
      setIsDarkTheme: () =>
        set((state) => ({ isDarkTheme: !state.isDarkTheme })),

      isCollected: false,
      isBookmarked: false,
      setIsCollected: (prev: boolean) => set({ isCollected: prev }),
      setIsBookmarked: (prev: boolean) => set({ isBookmarked: prev }),
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
