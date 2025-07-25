'use client';
import { useBookmarkedCafes } from './useBookmarkedCafes';

export function useBookmarkedCafesCounts(userId: string) {
  const { data } = useBookmarkedCafes(userId, true);
  
  return { 
    count: data?.length || 0 
  };
}
