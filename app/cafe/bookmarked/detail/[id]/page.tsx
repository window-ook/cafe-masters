'use client';

import { useEffect } from 'react';
import { useMapStore, useCheckStore } from 'utils/store';
import { getBookmarked } from 'actions/bookmarkActions';

export default function BookmarkedDetailpage({ params }) {
  const { id } = params;
  const setIsBookmarked = useCheckStore((state) => state.setIsBookmarked);
  const setBookmarkedCafeDetail = useMapStore(
    (state) => state.setBookmarkedCafeDetail
  );

  useEffect(() => {
    const fetchBookmarkedCafeDetail = async () => {
      try {
        const response = await getBookmarked(id);
        console.log(response);
        if (response && response.length > 0) setIsBookmarked(true);
        setBookmarkedCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarkedCafeDetail();
  }, [id]);

  return null;
}
