import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapStore, UserStore, CheckStore } from 'types/store';
import {
  AllCafe,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  Tier,
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
      setAllCafe: (data: AllCafe[]) => set({ allCafe: data }),
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

const NO_USER = 'no-user';

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      userId: NO_USER,
      userEmail: '새로고침 하기',
      userTier: 'BEGINNER',

      setUserId: (user: string) => set({ userId: user }),
      setUserEmail: (user: string) => set({ userEmail: user }),
      setUserTier: (user: Tier) => set({ userTier: user }),
    }),
    {
      name: 'userStore',
    },
  ),
);

export const useCheckStore = create<CheckStore>()(
  persist(
    set => ({
      isSubSidebarOpen: false,
      setIsSubSidebarOpen: (prev: boolean) => set({ isSubSidebarOpen: prev }),

      isExtend: false,
      isExtendComplete: false,
      setIsExtend: () => set(prev => ({ isExtend: !prev.isExtend })),
      setIsExtendComplete: () =>
        set(prev => ({ isExtendComplete: !prev.isExtendComplete })),

      isDarkTheme: false,
      setIsDarkTheme: () => set(prev => ({ isDarkTheme: !prev.isDarkTheme })),

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
