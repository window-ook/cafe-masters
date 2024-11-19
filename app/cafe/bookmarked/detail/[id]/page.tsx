'use client';

import { useEffect } from 'react';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import { getBookmarked } from 'actions/bookmarkActions';
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
    const fetchBookmarkedCafeDetail = async () => {
      try {
        const response = await getBookmarked(id, userId);
        // console.log(response);
        if (response && response.length >= 0) {
          setIsBookmarked(true);
          setBookmarkedCafeDetail(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmarkedCafeDetail();
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
