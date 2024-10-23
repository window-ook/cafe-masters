'use client';

import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { getAllBookmarked } from 'actions/bookmarkActions';
import { BookmarkedCafe } from 'types/types';

export default function BookmarkedPage() {
  const userId = useUserStore((state) => state.userId);
  const setBookmarkedCafe = useMapStore((state) => state.setBookmarkedCafe);

  const queryFn = async () => {
    const response = await getAllBookmarked(userId);
    setBookmarkedCafe(response);
    return response;
  };

  const options = {
    queryKey: ['bookmarkedCafe', userId],
    queryFn,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    onSuccess: (data: BookmarkedCafe[]) => console.log('북마크 카페: ', data),
    onError: (error: Error) =>
      console.error('북마크 카페 데이터 다운로드 에러: ', error),
  };

  const bookmarkedCafe = useQuery<BookmarkedCafe[], Error, [string, string]>(
    options
  );

  if (bookmarkedCafe) console.log('북마크 카페 : SUCCESS');

  return null;
}
