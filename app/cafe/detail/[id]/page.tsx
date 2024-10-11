'use client';

import { useEffect } from 'react';
import { useBookmarkStore, useMapStore } from 'utils/store';
import { cafeDatail } from 'actions/cafeDetailActions';
import { getBookmarked } from 'actions/bookmarkActions';

export default function CafeDetailPage({ params }) {
  const { id } = params;
  const setCafeDetail = useMapStore((state) => state.setCafeDetail);
  const setIsBookmarked = useBookmarkStore((state) => state.setIsBookmarked);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await cafeDatail(id);
        console.log(response);
        setCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchBookmarked = async () => {
      try {
        const response = await getBookmarked(id);
        const bookmarked = response && response.length > 0;
        setIsBookmarked(bookmarked);
        console.log('Bookmark 상태:', bookmarked);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookmarked();
  }, [id, setIsBookmarked]);

  return null;
}
