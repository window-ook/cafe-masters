import {
  AllCafe,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  FetchedCafeDetail,
  Tier,
} from './common';

export interface MapStore {
  keyword: string;
  allCafe: AllCafe[];
  collectedCafe: CollectedCafeFromSupabase[];
  collectedCafeCount: number;
  bookmarkedCafe: BookmarkedCafeFromSupabase[];
  bookmarkedCafeCount: number;
  thisX: number;
  thisY: number;
  cafeDetail: FetchedCafeDetail;
  collectedCafeDetail: CollectedCafeFromSupabase[];
  bookmarkedCafeDetail: BookmarkedCafeFromSupabase[];

  setKeyword: (data: string) => void;
  setAllCafe: (data: AllCafe[]) => void;
  setCollectedCafe: (data: CollectedCafeFromSupabase[]) => void;
  setCollectedCafeCount: (data: number) => void;
  setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) => void;
  setBookmarkedCafeCount: (data: number) => void;
  setThisX: (x: number) => void;
  setThisY: (y: number) => void;
  setCafeDetail: (data: object) => void;
  setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) => void;
  setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) => void;
}

export interface UserStore {
  userId: string;
  userEmail: string;
  userTier: Tier;

  setUserId: (user: string) => void;
  setUserEmail: (user: string) => void;
  setUserTier: (user: Tier) => void;
}

export interface CheckStore {
  isSubSidebarOpen: boolean;
  setIsSubSidebarOpen: (prev: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (prev: boolean) => void;

  isExtend: boolean;
  isExtendComplete: boolean;
  setIsExtend: () => void;
  setIsExtendComplete: () => void;

  isDarkTheme: boolean;
  setIsDarkTheme: () => void;

  isCollected: boolean;
  isBookmarked: boolean;
  setIsCollected: (prev: boolean) => void;
  setIsBookmarked: (prev: boolean) => void;

  isLoading: boolean;
  setIsLoading: (prev: boolean) => void;
}
