'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { countBookmarkedCafes } from 'actions/bookmarkActions';
import Head from 'next/head';

export default function BookmarkedPage() {
  const userId = useUserStore(state => state.userId);
  const setBookmarkedCafeCount = useMapStore(
    state => state.setBookmarkedCafeCount,
  );

  const countBookmarkedCafeQuery = useQuery({
    queryKey: ['bookmarkedCafeCount', userId],
    queryFn: async () => {
      const response = await countBookmarkedCafes(userId);
      return response || 0;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (countBookmarkedCafeQuery.isSuccess)
      setBookmarkedCafeCount(countBookmarkedCafeQuery.data);
  }, [
    countBookmarkedCafeQuery.data,
    countBookmarkedCafeQuery.isSuccess,
    setBookmarkedCafeCount,
  ]);

  return (
    <Head>
      <title>가고 싶은 카페 | 카페 마스터즈 Cafe Masters</title>
      <meta name="description" content={`가고 싶은 카페를 볼 수 있어요.`} />
    </Head>
  );
}
