'use client';

import { use } from 'react';
import { PageProps } from 'types/common';
import Head from 'next/head';
import useCafeDetailState from 'hooks/state/useCafeDetailState';

export default function RecommendedDetail({ params }: PageProps) {
  const { id } = use(params);

  useCafeDetailState(id, 'recommended');

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
