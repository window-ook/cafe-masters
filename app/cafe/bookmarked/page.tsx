'use client';

import { getAllBookmarked } from 'actions/bookmarkActions';
import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';

export default function BookmarkedPage() {
  const userId = useUserStore((state) => state.userId);
  const setBookmarkedCafe = useMapStore((state) => state.setBookmarkedCafe);

  useEffect(() => {
    const fetchBookmarked = async () => {
      try {
        const response = await getAllBookmarked(userId);
        console.log(response);
        if (response && response.length >= 0) setBookmarkedCafe(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarked();
  }, [userId]);
  return;
}
