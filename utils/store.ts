import {
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
} from 'types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMapStore = create(
  persist(
    (set: any) => ({
      keyword: '성수',
      allCafe: [],
      collectedCafe: [],
      collectedCafeCount: 0,
      bookmarkedCafe: [],
      thisX: 127.04663357436208,
      thisY: 37.54715716085294,
      cafeDetail: {},
      collectedCafeDetail: [],
      bookmarkedCafeDetail: [],

      setKeyword: (data: string) => set({ keyword: data }),
      setAllCafe: (data: any[]) => set({ allCafe: data ?? [] }),
      setCollectedCafe: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafe: data ?? [] }),
      setCollectedCafeCount: (data: number) =>
        set({ collectedCafeCount: data }),
      setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafe: data ?? [] }),
      setThisX: (x: string) => set({ thisX: x }),
      setThisY: (y: string) => set({ thisY: y }),
      setCafeDetail: (data: object) => set({ cafeDetail: data }),
      setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafeDetail: data }),
    }),
    {
      name: 'mapStore',
      getStorage: () => localStorage,
      partialize: (state: any) => ({
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
      merge: (persistedState: any, currentState: any) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export const useUserStore = create(
  persist(
    (set: any) => ({
      userId: null,
      userTier: 'BEGINNER',
      setUserId: (user: string) => set({ userId: user }),
      setUserTier: (tier: string) => set({ userTier: tier }),
    }),
    {
      name: 'userStore',
      getStorage: () => localStorage,
      partialize: (state: any) => ({
        userId: state.userId,
        userTier: state.userTier,
      }),
      merge: (persistedState: any, currentState: any) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);

export const useCheckStore = create(
  persist(
    (set: any) => ({
      isSubSidebarOpen: false,
      setIsSubSidebarOpen: (prev: boolean) => set({ isSubSidebarOpen: prev }),

      isExtend: false,
      isExtendComplete: false,
      setIsExtend: () => set((state: any) => ({ isExtend: !state.isExtend })),
      setIsExtendComplete: () =>
        set((state: any) => ({ isExtendComplete: !state.isExtendComplete })),

      isDarkTheme: false,
      setIsDarkTheme: () =>
        set((state: any) => ({ isDarkTheme: !state.isDarkTheme })),

      isCollected: false,
      isBookmarked: false,
      setIsCollected: (prev: boolean) => set({ isCollected: prev }),
      setIsBookmarked: (prev: boolean) => set({ isBookmarked: prev }),
    }),
    {
      name: 'checkStore',
      getStorage: () => localStorage,
      partialize: (state: any) => ({
        isSubSidebarOpen: state.isSubSidebarOpen,
        isDarkTheme: state.isDarkTheme,
      }),
      merge: (persistedState: any, currentState: any) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);
