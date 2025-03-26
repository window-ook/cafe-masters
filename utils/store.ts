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

      setKeyword: data => set({ keyword: data }),
      setSearchResult: (data: SearchResult[]) => set({ searchResult: data }),
      setCollectedCafe: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafe: data ?? [] }),
      setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafe: data }),
      setCollectedCafeCount: data => set({ collectedCafeCount: data }),
      setBookmarkedCafeCount: data => set({ bookmarkedCafeCount: data }),
      setThisX: x => set({ thisX: x }),
      setThisY: y => set({ thisY: y }),
      setThisId: id => set({ thisId: id }),
      setThisThumbnail: url => set({ thisThumbnail: url }),
      setCafeDetail: data => set({ cafeDetail: data }),
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
      admin: false,

      setUserId: user => set({ userId: user }),
      setUserEmail: user => set({ userEmail: user }),
      setUserTier: (user: Tier) => set({ userTier: user }),
      setAdmin: user => set({ admin: user }),
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

      setIsSubSidebarOpen: prev => set({ isSubSidebarOpen: prev }),
      setIsMenuOpen: prev => set({ isMenuOpen: prev }),
      setIsExtend: () => set(prev => ({ isExtend: !prev.isExtend })),
      setIsExtendComplete: () =>
        set(prev => ({ isExtendComplete: !prev.isExtendComplete })),
      setIsDarkTheme: () => set(prev => ({ isDarkTheme: !prev.isDarkTheme })),
      setIsCollected: prev => set({ isCollected: prev }),
      setIsBookmarked: prev => set({ isBookmarked: prev }),
      setIsLoading: prev => set({ isLoading: prev }),
    }),
    {
      name: 'checkStore',
    },
  ),
);
