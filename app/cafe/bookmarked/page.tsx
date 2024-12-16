'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { getAllBookmarkedCafes } from 'actions/bookmarkActions';
import Head from 'next/head';

export default function BookmarkedPage() {
  const userId = useUserStore(state => state.userId);
  const setBookmarkedCafe = useMapStore(state => state.setBookmarkedCafe);

  const bookmarkedCafe = useQuery({
    queryKey: ['bookmarkedCafe', userId],
    queryFn: async () => {
      const response = await getAllBookmarkedCafes(userId);
      return response;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (bookmarkedCafe.isSuccess) setBookmarkedCafe(bookmarkedCafe.data);
  }, [bookmarkedCafe.data, bookmarkedCafe.isSuccess, setBookmarkedCafe]);

  return (
    <Head>
      <title>가고 싶은 카페 | 카페 마스터즈 Cafe Masters</title>
      <meta name="description" content={`가고 싶은 카페를 볼 수 있어요.`} />
    </Head>
  );
}
