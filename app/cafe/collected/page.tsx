'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { countCollectedCafes } from 'actions/collectActions';
import Head from 'next/head';

export default function CollectedPage() {
  const userId = useUserStore(state => state.userId);
  const setCollectedCafeCount = useMapStore(
    state => state.setCollectedCafeCount,
  );

  const countCollectedCafeQuery = useQuery({
    queryKey: ['collectedCafeCount', userId],
    queryFn: async () => {
      const response = await countCollectedCafes(userId);
      return response || 0;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (countCollectedCafeQuery.isSuccess)
      setCollectedCafeCount(countCollectedCafeQuery.data);
  }, [
    countCollectedCafeQuery.data,
    countCollectedCafeQuery.isSuccess,
    setCollectedCafeCount,
  ]);

  return (
    <Head>
      <title>수집한 카드 | Cafe Masters</title>
      <meta name="description" content={`내가 수집한 카드들을 볼 수 있어요.`} />
    </Head>
  );
}
