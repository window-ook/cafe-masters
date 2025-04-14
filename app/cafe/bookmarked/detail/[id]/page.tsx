'use client';

import { use } from 'react';
import { useMapStore } from '@/utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';
import useCafeDetailState from 'hooks/state/useCafeDetailState';

export default function BookmarkedDetail({ params }: PageProps) {
  const { id } = use(params);
  const cafeName = useMapStore(state => state.bookmarkedCafeDetail[0].name);
  useCafeDetailState(id, 'bookmarked');

  return (
    <Head>
      <title>{cafeName} 상세 정보 | Cafe Masters</title>
      <meta
        name="description"
        content={`선택한 북마크 카페의 상세 정보를 볼 수 있어요.`}
      />
    </Head>
  );
}
