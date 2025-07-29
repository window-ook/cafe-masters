'use client';

import { useUserStore } from '@/stores';
import { useBookmarkedCafesCounts } from '@/hooks/supabase/bookmark';
import { useCollectedCafesCounts } from '@/hooks/supabase/useCollectedCafes';
import { useRecommendedCafesCounts } from '@/hooks/supabase/useRecommendedCafes';

export default function MainClient() {
  const userId = useUserStore(state => state.userId);

  useCollectedCafesCounts(userId);
  useBookmarkedCafesCounts(userId);
  useRecommendedCafesCounts();

  return null;
}