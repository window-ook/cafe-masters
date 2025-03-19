'use client';

import { useEffect, use } from 'react';
import { useMapStore } from 'utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function CollectedDetail({ params }: PageProps) {
  const { id } = use(params);

  const collectedCafe = useMapStore(state => state.collectedCafe);
  const setCollectedCafeDetail = useMapStore(
    state => state.setCollectedCafeDetail,
  );

  useEffect(() => {
    const numericId = parseFloat(id);
    const targetCafe = collectedCafe.find(cafe => cafe.id === numericId);
    if (targetCafe) setCollectedCafeDetail([targetCafe]);
  }, [id, collectedCafe, setCollectedCafeDetail]);

  return (
    <Head>
      <title>수집한 카드의 상세 정보 | Cafe Masters</title>
      <meta
        name="description"
        content={`선택한 카드의 상세 정보를 볼 수 있어요.`}
      />
    </Head>
  );
}
