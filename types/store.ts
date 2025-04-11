import {
  SearchResult,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  FetchedCafeDetail,
  Tier,
  RecommendedCafeFromSupabase,
} from './common';

// 지도 & 카페 데이터
export interface MapStore {
  keyword: string;
  searchResult: SearchResult[];
  collectedCafe: CollectedCafeFromSupabase[];
  filteredCollectedCafe: CollectedCafeFromSupabase[];
  bookmarkedCafe: BookmarkedCafeFromSupabase[];
  recommendedCafe: RecommendedCafeFromSupabase[];
  filteredRecommendedCafe: RecommendedCafeFromSupabase[];
  searchTermInCollectedCafe: string;
  searchTermInBookmarkedCafe: string;
  selectedRegion: string;
  selectedRating: string | number;
  collectedCafeCount: number;
  bookmarkedCafeCount: number;
  recommendedCafeCount: number;

  currentCoordX: number;
  currentCoordY: number;
  currentCafeId: number;
  currentCafeThumbnail: string;
  cafeDetail: FetchedCafeDetail;
  collectedCafeDetail: CollectedCafeFromSupabase[];
  bookmarkedCafeDetail: BookmarkedCafeFromSupabase[];
  recommendedCafeDetail: RecommendedCafeFromSupabase[];

  setKeyword: (data: string) => void;
  setSearchResult: (data: SearchResult[]) => void;
  setCollectedCafe: (data: CollectedCafeFromSupabase[]) => void;
  setFilteredCollectedCafe: (data: CollectedCafeFromSupabase[]) => void;
  setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) => void;
  setRecommendedCafe: (data: RecommendedCafeFromSupabase[]) => void;
  setFilteredRecommendedCafe: (data: RecommendedCafeFromSupabase[]) => void;
  setSearchTermInCollectedCafe: (term: string) => void;
  setSearchTermInBookmarkedCafe: (term: string) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedRating: (rating: string | number) => void;
  setCollectedCafeCount: (data: number) => void;
  setBookmarkedCafeCount: (data: number) => void;
  setRecommendedCafeCount: (data: number) => void;

  setCurrentCoordX: (x: number) => void;
  setCurrentCoordY: (y: number) => void;
  setCurrentCafeId: (Id: number) => void;
  setCurrentCafeThumbnail: (url: string) => void;
  setCafeDetail: (data: object) => void;
  setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) => void;
  setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) => void;
  setRecommendedCafeDetail: (data: RecommendedCafeFromSupabase[]) => void;
}

// 유저 데이터
export interface UserStore {
  userId: string;
  userEmail: string;
  userTier: Tier;
  admin: boolean;
  setUserId: (user: string) => void;
  setUserEmail: (user: string) => void;
  setUserTier: (user: Tier) => void;
  setAdmin: (user: boolean) => void;
}

// 체크 데이터
export interface CheckStore {
  isSubSidebarOpen: boolean;
  isMenuOpen: boolean;
  isExtend: boolean;
  isExtendComplete: boolean;
  isDarkTheme: boolean;
  isCollected: boolean;
  isBookmarked: boolean;
  isRecommended: boolean;
  isLoading: boolean;
  setIsSubSidebarOpen: (prev: boolean) => void;
  setIsMenuOpen: (prev: boolean) => void;
  setIsExtend: () => void;
  setIsExtendComplete: () => void;
  setIsDarkTheme: () => void;
  setIsCollected: (prev: boolean) => void;
  setIsBookmarked: (prev: boolean) => void;
  setIsRecommended: (prev: boolean) => void;
  setIsLoading: (prev: boolean) => void;
}
