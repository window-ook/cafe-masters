'use client';

import { useEffect, use } from 'react';
import { useMapStore } from 'utils/store';
import { ClientPageProps, UrlParams } from 'types/shared/page';

export default function CollectedCafeDetailClient({ params }: ClientPageProps) {
  const resolvedParams: UrlParams = use(params);
  const { id } = resolvedParams;
  const numericId = parseFloat(id);

  const { collectedCafe, setCollectedCafeDetail } = useMapStore();

  useEffect(() => {
    const targetCafe = collectedCafe.find(cafe => cafe.id === numericId);
    if (targetCafe) setCollectedCafeDetail([targetCafe]);
  }, [id, numericId, collectedCafe, setCollectedCafeDetail]);

  return null;
}
