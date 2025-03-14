import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapStore, UserStore, CheckStore } from 'types/store';
import {
  SearchResult,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  Tier,
} from 'types/common';

export const useMapStore = create<MapStore>()(
  persist(
    set => ({
      keyword: '성수',
      searchResult: [],
      collectedCafe: [],
      bookmarkedCafe: [],
      collectedCafeCount: 0,
      bookmarkedCafeCount: 0,
      thisX: 127.04663357436208,
      thisY: 37.54715716085294,
      thisId: 12345678,
      thisThumbnail: '',
      cafeDetail: {},
      collectedCafeDetail: [],
      bookmarkedCafeDetail: [],
      collectedSearchTerm: '',
      bookmarkedSearchTerm: '',

      setKeyword: (data: string) => set({ keyword: data }),
      setSearchResult: (data: SearchResult[]) => set({ searchResult: data }),
      setCollectedCafe: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafe: data ?? [] }),
      setCollectedCafeCount: (data: number) =>
        set({ collectedCafeCount: data }),
      setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafe: data }),
      setBookmarkedCafeCount: (data: number) =>
        set({ bookmarkedCafeCount: data }),
      setThisX: (x: number) => set({ thisX: x }),
      setThisY: (y: number) => set({ thisY: y }),
      setThisId: (Id: number) => set({ thisId: Id }),
      setCafeDetail: (data: object) => set({ cafeDetail: data }),
      setThisThumbnail: (url: string) => set({ thisThumbnail: url }),
      setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafeDetail: data }),
      setCollectedSearchTerm: term => set({ collectedSearchTerm: term }),
      setBookmarkedSearchTerm: term => set({ bookmarkedSearchTerm: term }),
    }),
    {
      name: 'mapStore',
    },
  ),
);

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      userId: '',
      userEmail: '',
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
      isMenuOpen: false,
      isExtend: false,
      isExtendComplete: false,
      isDarkTheme: false,
      isCollected: false,
      isBookmarked: false,
      isLoading: false,

      setIsSubSidebarOpen: (prev: boolean) => set({ isSubSidebarOpen: prev }),
      setIsMenuOpen: (prev: boolean) => set({ isMenuOpen: prev }),
      setIsExtend: () => set(prev => ({ isExtend: !prev.isExtend })),
      setIsExtendComplete: () =>
        set(prev => ({ isExtendComplete: !prev.isExtendComplete })),
      setIsDarkTheme: () => set(prev => ({ isDarkTheme: !prev.isDarkTheme })),
      setIsCollected: (prev: boolean) => set({ isCollected: prev }),
      setIsBookmarked: (prev: boolean) => set({ isBookmarked: prev }),
      setIsLoading: (prev: boolean) => set({ isLoading: prev }),
    }),
    {
      name: 'checkStore',
    },
  ),
);
