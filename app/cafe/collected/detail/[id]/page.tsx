'use client';

import { useEffect, use } from 'react';
import { useMapStore } from 'utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function CollectedDetail({ params }: PageProps) {
  const { id } = use(params);
  const numericId = parseFloat(id);

  const { collectedCafe, setCollectedCafeDetail } = useMapStore();
  const cardName = useMapStore(state => state.collectedCafeDetail[0].name);
  useEffect(() => {
    const targetCafe = collectedCafe.find(cafe => cafe.id === numericId);
    if (targetCafe) setCollectedCafeDetail([targetCafe]);
  }, [id, numericId, collectedCafe, setCollectedCafeDetail]);

  return (
    <Head>
      <title>{cardName} 상세 정보 | Cafe Masters</title>
      <meta
        name="description"
        content={`선택한 카드의 상세 정보를 볼 수 있어요.`}
      />
    </Head>
  );
}
