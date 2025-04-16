'use client';

import { useUserStore } from 'utils/store';
import useCountCollectedQuery from 'hooks/cache/useCountCollectedQuery';
import useCountBookmarkedQuery from 'hooks/cache/useCountBookmarkedQuery';
import useCountRecommendedQuery from 'hooks/cache/useCountRecommendedQuery';

export default function CafeUI() {
  const userId = useUserStore(state => state.userId);

  useCountCollectedQuery(userId);
  useCountBookmarkedQuery(userId);
  useCountRecommendedQuery();

  return null;
}
