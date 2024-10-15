'use client';

import { useEffect } from 'react';
import { useCheckStore, useMapStore } from 'utils/store';
import { cafeDetail } from 'actions/cafeDetailActions';
import { getBookmarked } from 'actions/bookmarkActions';
import { getCollected } from 'actions/collectedActions';

export default function CafeDetailPage({ params }) {
  const { id } = params;
  const setCafeDetail = useMapStore((state) => state.setCafeDetail);
  const setIsBookmarked = useCheckStore((state) => state.setIsBookmarked);
  const setIsCollected = useCheckStore((state) => state.setIsCollected);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await cafeDetail(id);
        console.log(response);
        setCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCollected = async () => {
      try {
        const response = await getCollected(id);
        const collected = response && response.length > 0;
        setIsCollected(collected);
      } catch (error) {}
    };

    const fetchBookmarked = async () => {
      try {
        const response = await getBookmarked(id);
        if (response && response.length > 0) setIsBookmarked(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetail();
    fetchCollected();
    fetchBookmarked();
  }, [id]);

  return null;
}
