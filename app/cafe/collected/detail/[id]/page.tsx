'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';
import { getCollected } from 'actions/collectedActions';
import { PageProps } from 'types/types';

export default function CollectedDetailPage({ params }: PageProps) {
  const { id } = params;
  const userId = useUserStore((state: any) => state.userId);
  const setCollectedCafeDetail = useMapStore(
    (state: any) => state.setCollectedCafeDetail
  );

  useEffect(() => {
    const fetchCollectedCafeDetail = async () => {
      try {
        const response = await getCollected(id, userId);
        console.log(response);
        if (response && response.length > 0) setCollectedCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollectedCafeDetail();
  }, [id]);

  return null;
}
