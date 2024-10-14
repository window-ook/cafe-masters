'use client';

import { useEffect } from 'react';
import { useMapStore } from 'utils/store';
import { getCollected } from 'actions/collectedActions';

export default function CollectedDetailPage({ params }) {
  const { id } = params;
  const setCollectedCafeDetail = useMapStore(
    (state) => state.setCollectedCafeDetail
  );

  useEffect(() => {
    const fetchCollectedDetail = async () => {
      try {
        const response = await getCollected(id);
        console.log(response);
        setCollectedCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollectedDetail();
  }, [id]);

  return null;
}
