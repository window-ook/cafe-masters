import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapStore, UserStore, CheckStore } from 'types/store';
import {
  SearchResult,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  RecommendedCafeFromSupabase,
  Tier,
} from 'types/common';

export const useMapStore = create<MapStore>()(
  persist(
    set => ({
      keyword: '성수',
      searchResult: [],
      collectedCafe: [],
      filteredCollectedCafe: [],
      bookmarkedCafe: [],
      recommendedCafe: [],
      filteredRecommendedCafe: [],
      collectedCafeCount: 0,
      bookmarkedCafeCount: 0,
      recommendedCafeCount: 0,
      currentCoordX: 127.04663357436208,
      currentCoordY: 37.54715716085294,
      currentCafeId: 12345678,
      currentCafeThumbnail: '',
      cafeDetail: {},
      collectedCafeDetail: [],
      bookmarkedCafeDetail: [],
      recommendedCafeDetail: [],
      searchTermInCollectedCafe: '',
      searchTermInBookmarkedCafe: '',
      selectedRegion: 'all',
      selectedRating: 'all',

      setKeyword: data => set({ keyword: data }),
      setSearchResult: (data: SearchResult[]) => set({ searchResult: data }),
      setCollectedCafe: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafe: data ?? [] }),
      setFilteredCollectedCafe: (data: CollectedCafeFromSupabase[]) =>
        set({ filteredCollectedCafe: data ?? [] }),
      setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafe: data }),
      setRecommendedCafe: (data: RecommendedCafeFromSupabase[]) =>
        set({ recommendedCafe: data }),
      setCollectedCafeCount: data => set({ collectedCafeCount: data }),
      setBookmarkedCafeCount: data => set({ bookmarkedCafeCount: data }),
      setRecommendedCafeCount: data => set({ recommendedCafeCount: data }),
      setCurrentCoordX: x => set({ currentCoordX: x }),
      setCurrentCoordY: y => set({ currentCoordY: y }),
      setCurrentCafeId: id => set({ currentCafeId: id }),
      setCurrentCafeThumbnail: url => set({ currentCafeThumbnail: url }),
      setCafeDetail: data => set({ cafeDetail: data }),
      setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) =>
        set({ collectedCafeDetail: data }),
      setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) =>
        set({ bookmarkedCafeDetail: data }),
      setRecommendedCafeDetail: (data: RecommendedCafeFromSupabase[]) =>
        set({ recommendedCafeDetail: data }),
      setFilteredRecommendedCafe: (data: RecommendedCafeFromSupabase[]) =>
        set({ filteredRecommendedCafe: data }),
      setSearchTermInCollectedCafe: term => set({ searchTermInCollectedCafe: term }),
      setSearchTermInBookmarkedCafe: term => set({ searchTermInBookmarkedCafe: term }),
      setSelectedRegion: (region: string) => set({ selectedRegion: region }),
      setSelectedRating: (rating: string | number) =>
        set({ selectedRating: rating }),
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
      isRecommended: false,
      isLoading: false,

      setIsSubSidebarOpen: prev => set({ isSubSidebarOpen: prev }),
      setIsMenuOpen: prev => set({ isMenuOpen: prev }),
      setIsExtend: () => set(prev => ({ isExtend: !prev.isExtend })),
      setIsExtendComplete: () =>
        set(prev => ({ isExtendComplete: !prev.isExtendComplete })),
      setIsDarkTheme: () => set(prev => ({ isDarkTheme: !prev.isDarkTheme })),
      setIsCollected: prev => set({ isCollected: prev }),
      setIsBookmarked: prev => set({ isBookmarked: prev }),
      setIsRecommended: prev => set({ isRecommended: prev }),
      setIsLoading: prev => set({ isLoading: prev }),
    }),
    {
      name: 'checkStore',
    },
  ),
);
