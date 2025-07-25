import { Tier } from './shared/sidebar';
import { IKakaoSearchResult } from './kakao-map/kakao-map';
import { CafeDetail } from './shared/cafe-detail';
import { ISupabaseBookmarkedCafe } from './supabase/bookmark';
import { ISupabaseCollectedCafe } from './supabase/collection';
import { ISupabaseRecommendedCafe } from './supabase/recommendation';

export interface MapStore {
  keyword: string;
  searchResult: IKakaoSearchResult[];
  collectedCafe: ISupabaseCollectedCafe[];
  filteredCollectedCafe: ISupabaseCollectedCafe[];
  bookmarkedCafe: ISupabaseBookmarkedCafe[];
  filteredBookmarkedCafe: ISupabaseBookmarkedCafe[];
  recommendedCafe: ISupabaseRecommendedCafe[];
  filteredRecommendedCafe: ISupabaseRecommendedCafe[];
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
  cafeDetail: CafeDetail;
  collectedCafeDetail: ISupabaseCollectedCafe[];
  bookmarkedCafeDetail: ISupabaseBookmarkedCafe[];
  recommendedCafeDetail: ISupabaseRecommendedCafe[];

  setKeyword: (data: string) => void;
  setSearchResult: (data: IKakaoSearchResult[]) => void;
  setCollectedCafe: (data: ISupabaseCollectedCafe[]) => void;
  setFilteredCollectedCafe: (data: ISupabaseCollectedCafe[]) => void;
  setBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => void;
  setFilteredBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => void;
  setRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;
  setFilteredRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;
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
  setCollectedCafeDetail: (data: ISupabaseCollectedCafe[]) => void;
  setBookmarkedCafeDetail: (data: ISupabaseBookmarkedCafe[]) => void;
  setRecommendedCafeDetail: (data: ISupabaseRecommendedCafe[]) => void;
}

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
