import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapStore, UserStore, CheckStore } from 'types/store';
import {
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
} from 'types/common';

export const useMapStore = create<MapStore>()(
  persist(
    set => ({
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
      setAllCafe: (data: Record<string, string>[]) =>
        set({ allCafe: data ?? [] }),
      setCollectedCafe: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafe: data ?? [] }),
      setCollectedCafeCount: (data: number) =>
        set({ collectedCafeCount: data }),
      setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafe: data }),
      setThisX: (x: number) => set({ thisX: x }),
      setThisY: (y: number) => set({ thisY: y }),
      setCafeDetail: (data: object) => set({ cafeDetail: data }),
      setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafeDetail: data }),
    }),
    {
      name: 'mapStore',
    },
  ),
);

// UserStore
export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      userId: null,
      userEmail: '새로고침 하기',
      userTier: 'BEGINNER',

      setUserId: (user: string) => set({ userId: user }),
      setUserEmail: (user: string) => set({ userEmail: user }),
      setUserTier: (user: string) => set({ userTier: user }),
    }),
    {
      name: 'userStore',
    },
  ),
);

// CheckStore
export const useCheckStore = create<CheckStore>()(
  persist(
    set => ({
      isSubSidebarOpen: false,
      setIsSubSidebarOpen: (prev: boolean) => set({ isSubSidebarOpen: prev }),

      isExtend: false,
      isExtendComplete: false,
      setIsExtend: () => set((prev: boolean) => ({ isExtend: !prev.isExtend })),
      setIsExtendComplete: () =>
        set((prev: boolean) => ({ isExtendComplete: !state.isExtendComplete })),

      isDarkTheme: false,
      setIsDarkTheme: () =>
        set((prev: boolean) => ({ isDarkTheme: !prev.isDarkTheme })),

      isCollected: false,
      isBookmarked: false,
      setIsCollected: (prev: boolean) => set({ isCollected: prev }),
      setIsBookmarked: (prev: boolean) => set({ isBookmarked: prev }),
    }),
    {
      name: 'checkStore',
    },
  ),
);
