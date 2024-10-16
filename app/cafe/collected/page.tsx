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
    const fetchData = async () => {
      try {
        const collectedResponse = await getAllCollected(userId);
        console.log(collectedResponse);
        if (collectedResponse && collectedResponse.length >= 0)
          setCollectedCafe(collectedResponse);

        const countResponse = await countCollected(userId);
        if (collectedResponse) setCollectedCafeCount(countResponse?.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return;
}
