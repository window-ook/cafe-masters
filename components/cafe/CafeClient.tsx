'use client';

import { useUserStore } from 'utils/store';
import { useCountBookmarkedCafesCounts } from '@/hooks/supabase/useBookmarkedCafesCounts';
import { useCollectedCafesCounts } from '@/hooks/supabase/useCollectedCafesCounts';
import { useRecommendedCafesCounts } from '@/hooks/supabase/useRecommendedCafesCounts';

export default function CafeClient() {
  const userId = useUserStore(state => state.userId);

  useCollectedCafesCounts(userId);
  useCountBookmarkedCafesCounts(userId);
  useRecommendedCafesCounts();

  return null;
}
