'use client';

import { useEffect } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { cafeDetail } from 'actions/cafeDetailActions';
import { getBookmarked } from 'actions/bookmarkActions';
import { getCollected } from 'actions/collectedActions';
import { PageProps } from 'types/types';

export default function CafeDetailPage({ params }: PageProps) {
  const { id } = params;
  const userId = useUserStore((state: any) => state.userId);
  const setCafeDetail = useMapStore((state: any) => state.setCafeDetail);
  const setIsBookmarked = useCheckStore((state: any) => state.setIsBookmarked);
  const setIsCollected = useCheckStore((state: any) => state.setIsCollected);

  useEffect(() => {
    setIsBookmarked(false);
    setIsCollected(false);

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
        const response = await getCollected(id, userId);
        if (response && response.length > 0) setIsCollected(true);
      } catch (error) {}
    };

    const fetchBookmarked = async () => {
      try {
        const response = await getBookmarked(id, userId);
        if (response && response.length > 0) setIsBookmarked(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetail();
    fetchBookmarked();
    fetchCollected();
  }, [id]);

  return null;
}
