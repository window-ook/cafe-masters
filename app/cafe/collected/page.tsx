'use client';

import { getAllCollected } from 'actions/collectedActions';
import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';

export default function CollectedPage() {
  const userId = useUserStore((state) => state.userId);
  const setCollectedCafe = useMapStore((state) => state.setCollectedCafe);

  useEffect(() => {
    const fetchCollected = async () => {
      try {
        const response = await getAllCollected(userId);
        console.log(response);
        setCollectedCafe(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollected();
  }, [userId]);
  return;
}
