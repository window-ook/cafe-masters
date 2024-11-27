'use client';

import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { getAllBookmarkedCafes } from 'actions/bookmarkActions';
import { BookmarkedCafeFromSupabase } from 'types/types';
import Head from 'next/head';

export default function BookmarkedPage() {
  const userId = useUserStore((state: any) => state.userId);
  const setBookmarkedCafe = useMapStore(
    (state: any) => state.setBookmarkedCafe
  );

  const queryFn = async () => {
    const response = await getAllBookmarkedCafes(userId);
    setBookmarkedCafe(response);
    return response;
  };

  const options = {
    queryKey: ['bookmarkedCafe', userId],
    queryFn,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    onSuccess: (data: BookmarkedCafeFromSupabase[]) =>
      console.log('북마크 카페: ', data),
    onError: (error: Error) =>
      console.error('북마크 카페 데이터 다운로드 에러: ', error),
  };

  const bookmarkedCafe = useQuery<
    BookmarkedCafeFromSupabase[],
    Error,
    [string, string]
  >(options);

  if (bookmarkedCafe) console.log('가고 싶은 카페 확인');

  return (
    <Head>
      <title>가고 싶은 카페 | 카페 마스터즈 Cafe Masters</title>
      <meta name="description" content={`북마크 해둔 카페를 볼 수 있어요.`} />
    </Head>
  );
}
