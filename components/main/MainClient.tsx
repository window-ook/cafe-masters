'use client';

import { useUserStore } from '@/stores';
import { useBookmarkCounts } from '@/hooks/supabase/bookmark';
import { useCollectionCounts } from '@/hooks/supabase/collection';
import { useRecommendationCounts } from '@/hooks/supabase/recommendation';

export default function MainClient() {
  const userId = useUserStore(state => state.userId);

  useCollectionCounts(userId);
  useBookmarkCounts(userId);
  useRecommendationCounts();

  return null;
}
