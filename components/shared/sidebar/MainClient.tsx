'use client';

import { useUserStore } from '@/stores';
import { useBookmarkedCafesCounts } from '@/hooks/supabase/useBookmarkedCafesCounts';
import { useCollectedCafesCounts } from '@/hooks/supabase/useCollectedCafesCounts';
import { useRecommendedCafesCounts } from '@/hooks/supabase/useRecommendedCafesCounts';

export default function MainClient() {
  const userId = useUserStore(state => state.userId);

  useCollectedCafesCounts(userId);
  useBookmarkedCafesCounts(userId);
  useRecommendedCafesCounts();

  return null;
}
