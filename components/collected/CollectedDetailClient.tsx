'use client';

import { useEffect, use } from 'react';
import { useMapStore } from 'utils/store';
import { PageProps } from 'types/common';

export default function CollectedDetailClient({ params }: PageProps) {
  const { id } = use(params);
  const numericId = parseFloat(id);

  const { collectedCafe, setCollectedCafeDetail } = useMapStore();

  useEffect(() => {
    const targetCafe = collectedCafe.find(cafe => cafe.id === numericId);
    if (targetCafe) setCollectedCafeDetail([targetCafe]);
  }, [id, numericId, collectedCafe, setCollectedCafeDetail]);

  return null;
}
