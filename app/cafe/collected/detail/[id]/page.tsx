'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';
import { getCollectedCafe } from 'actions/collectActions';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function CollectedDetailPage({ params }: PageProps) {
  const { id } = params;
  const userId = useUserStore(state => state.userId);
  const setCollectedCafeDetail = useMapStore(
    state => state.setCollectedCafeDetail,
  );

  useEffect(() => {
    const fetchCollectedCafeDetail = async () => {
      try {
        const numericId = parseFloat(id);
        const response = await getCollectedCafe(numericId, userId);
        if (response?.length) setCollectedCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) fetchCollectedCafeDetail();
  }, [id, userId, setCollectedCafeDetail]);

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
