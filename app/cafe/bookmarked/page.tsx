'use client';

import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { getAllBookmarked } from 'actions/bookmarkActions';

export default function BookmarkedPage() {
  const userId = useUserStore((state) => state.userId);
  const setBookmarkedCafe = useMapStore((state) => state.setBookmarkedCafe);

  // useEffect(() => {
  //   const fetchBookmarked = async () => {
  //     try {
  //       const response = await getAllBookmarked(userId);
  //       console.log('북마크 카페:', response);
  //       if (response && response.length >= 0) setBookmarkedCafe(response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchBookmarked();
  // }, [userId]);

  const bookmarkedResult = useQuery({
    queryKey: ['bookmarkedCafe', userId],
    queryFn: async () => {
      const response = await getAllBookmarked(userId);
      setBookmarkedCafe(response);
      return response;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) =>
      console.error('북마크 카페 데이터 다운로드 에러: ', error),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  if (bookmarkedResult) console.log('북마크 카페 : SUCCESS');

  return null;
}
