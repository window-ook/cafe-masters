'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';
import { getCollected } from 'actions/collectedActions';

export default function CollectedDetailPage({ params }) {
  const { id } = params;
  const userId = useUserStore((state) => state.userId);
  const setCollectedCafeDetail = useMapStore(
    (state) => state.setCollectedCafeDetail
  );

  useEffect(() => {
    const fetchCollectedCafeDetail = async () => {
      if (!userId || !id) {
        console.error('Invalid userId or id');
        return;
      }

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
