'use client';
import { useCollectedCafes } from './useCollectedCafes';

export function useCollectedCafesCounts(userId: string) {
  const { data } = useCollectedCafes(userId, true);
  
  return { 
    count: data?.length || 0 
  };
}