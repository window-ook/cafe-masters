'use client';

import { useEffect } from 'react';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import { getBookmarked } from 'actions/bookmarkActions';

export default function BookmarkedDetailpage({ params }) {
  const { id } = params;
  const userId = useUserStore((state) => state.userId);
  const setIsBookmarked = useCheckStore((state) => state.setIsBookmarked);
  const setBookmarkedCafeDetail = useMapStore(
    (state) => state.setBookmarkedCafeDetail
  );

  useEffect(() => {
    const fetchBookmarkedCafeDetail = async () => {
      try {
        const response = await getBookmarked(id, userId);
        console.log(response);
        if (response && response.length >= 0) {
          setIsBookmarked(true);
          setBookmarkedCafeDetail(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarkedCafeDetail();
  }, [id, userId]);

  return null;
}
