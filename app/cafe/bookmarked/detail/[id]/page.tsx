'use client';

import { useEffect, use } from 'react';
import { useMapStore, useCheckStore } from 'utils/store';
import { PageProps } from 'types/common';

import Head from 'next/head';

export default function BookmarkedDetailpage({ params }: PageProps) {
  const { id } = use(params);

  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const setBookmarkedCafeDetail = useMapStore(
    state => state.setBookmarkedCafeDetail,
  );

  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);

  useEffect(() => {
    const numericId = parseFloat(id);

    const foundCafe = bookmarkedCafe.find(cafe => cafe.id === numericId);

    if (foundCafe) {
      setIsBookmarked(true);
      setBookmarkedCafeDetail([foundCafe]);
    }
  }, [bookmarkedCafe, id, setBookmarkedCafeDetail, setIsBookmarked]);

  return (
    <Head>
      <title>가고 싶은 카페의 상세 정보 | 카페 마스터즈 Cafe Masters</title>
      <meta
        name="description"
        content={`가고 싶은 카페의 상세 정보를 볼 수 있어요.`}
      />
    </Head>
  );
}
