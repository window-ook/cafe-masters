'use client';

import { useEffect, use } from 'react';
import { useMapStore } from 'utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function RecommendedDetail({ params }: PageProps) {
  const { id } = use(params);

  const recommendedCafe = useMapStore(state => state.recommendedCafe);
  const setRecommendedCafeDetail = useMapStore(
    state => state.setRecommendedCafeDetail,
  );

  useEffect(() => {
    const numericId = parseFloat(id);
    const targetCafe = recommendedCafe.find(cafe => cafe.id === numericId);
    if (targetCafe) setRecommendedCafeDetail([targetCafe]);
  }, [id, recommendedCafe, setRecommendedCafeDetail]);

  return (
    <Head>
      <title>추천 카페 상세 정보 | Cafe Masters</title>
      <meta
        name="description"
        content={`추천 카페의 상세 정보를 볼 수 있어요.`}
      />
    </Head>
  );
}
