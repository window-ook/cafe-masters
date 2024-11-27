'use client';

import { useEffect } from 'react';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import { getBookmarkedCafe } from 'actions/bookmarkActions';
import { PageProps } from 'types/types';
import Head from 'next/head';

export default function BookmarkedDetailpage({ params }: PageProps) {
  const { id } = params;
  const userId = useUserStore((state: any) => state.userId);
  const setIsBookmarked = useCheckStore((state: any) => state.setIsBookmarked);
  const setBookmarkedCafeDetail = useMapStore(
    (state: any) => state.setBookmarkedCafeDetail
  );

  useEffect(() => {
    const fetchBookmarkedCafe = async () => {
      try {
        const response = await getBookmarkedCafe(id, userId);
        if (response?.length) {
          setIsBookmarked(true);
          setBookmarkedCafeDetail(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarkedCafe();
  }, [id, userId]);

  return (
    <Head>
      <title>북마크 카페의 상세 정보 | 카페 마스터즈 Cafe Masters</title>
      <meta
        name="description"
        content={`선택한 북마크 카페의 상세 정보를 볼 수 있어요.`}
      />
    </Head>
  );
}
