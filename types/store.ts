import {
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
} from './common';

export interface MapStore {
  keyword: string;
  allCafe: Record<string, string>[];
  collectedCafe: CollectedCafeFromSupabase[];
  collectedCafeCount: number;
  bookmarkedCafe: BookmarkedCafeFromSupabase[];
  thisX: number;
  thisY: number;
  cafeDetail: object;
  collectedCafeDetail: CollectedCafeFromSupabase[];
  bookmarkedCafeDetail: BookmarkedCafeFromSupabase[];

  setKeyword: (data: string) => void;
  setAllCafe: (data: Record<string, string>[]) => void;
  setCollectedCafe: (data: CollectedCafeFromSupabase[]) => void;
  setCollectedCafeCount: (data: number) => void;
  setBookmarkedCafe: (data: BookmarkedCafeFromSupabase[]) => void;
  setThisX: (x: number) => void;
  setThisY: (y: number) => void;
  setCafeDetail: (data: object) => void;
  setCollectedCafeDetail: (data: CollectedCafeFromSupabase[]) => void;
  setBookmarkedCafeDetail: (data: BookmarkedCafeFromSupabase[]) => void;
}

export interface UserStore {
  userId: string | null;
  userEmail: string;
  userTier: string;

  setUserId: (user: string) => void;
  setUserEmail: (user: string) => void;
  setUserTier: (user: string) => void;
}

export interface CheckStore {
  isSubSidebarOpen: boolean;
  setIsSubSidebarOpen: (prev: boolean) => void;

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
}
