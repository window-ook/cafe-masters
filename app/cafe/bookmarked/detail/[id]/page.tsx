'use client';

import { useEffect } from 'react';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import { getBookmarkedCafe } from 'actions/bookmarkActions';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function BookmarkedDetailpage({ params }: PageProps) {
  const { id } = params;
  const userId = useUserStore(state => state.userId);
  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);
  const setBookmarkedCafeDetail = useMapStore(
    state => state.setBookmarkedCafeDetail,
  );

  useEffect(() => {
    const fetchBookmarkedCafe = async () => {
      try {
        const numericId = parseFloat(id);
        const response = await getBookmarkedCafe(numericId, userId);
        if (response?.length) {
          setIsBookmarked(true);
          setBookmarkedCafeDetail(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarkedCafe();
  }, [id, userId, setBookmarkedCafeDetail, setIsBookmarked]);

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
