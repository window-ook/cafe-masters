'use client';

import { countCollected, getAllCollected } from 'actions/collectedActions';
import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';

export default function CollectedPage() {
  const userId = useUserStore((state) => state.userId);
  const setCollectedCafe = useMapStore((state) => state.setCollectedCafe);
  const setCollectedCafeCount = useMapStore(
    (state) => state.setCollectedCafeCount
  );

  useEffect(() => {
    const fetchCollected = async () => {
      try {
        const response = await getAllCollected(userId);
        setCollectedCafe(response);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCount = async () => {
      try {
        const response = await countCollected(userId);
        setCollectedCafeCount(response?.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollected();
    fetchCount();
  }, [userId]);
  return;
}
