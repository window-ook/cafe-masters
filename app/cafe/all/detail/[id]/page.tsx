'use client';

import { useEffect } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { getCafeDetail } from 'actions/cafeDetailActions';
import { getBookmarkedCafe } from 'actions/bookmarkActions';
import { getCollectedCafe } from 'actions/collectActions';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function AllDetailPage({ params }: PageProps) {
  const { id } = params;
  const userId = useUserStore(state => state.userId);
  const setCafeDetail = useMapStore(state => state.setCafeDetail);
  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);
  const setIsCollected = useCheckStore(state => state.setIsCollected);

  useEffect(() => {
    if (!userId || userId === 'no-user') return;

    setIsBookmarked(false);
    setIsCollected(false);

    const numericId = parseFloat(id);

    const fetchAllData = async () => {
      try {
        const [cafeDetailResponse, bookmarkedResponse, collectedResponse] =
          await Promise.all([
            getCafeDetail(id),
            getBookmarkedCafe(numericId, userId),
            getCollectedCafe(numericId, userId),
          ]);

        setCafeDetail(cafeDetailResponse);

        if (bookmarkedResponse?.length) {
          setIsBookmarked(true);
        }

        if (collectedResponse?.length) {
          setIsCollected(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, [id, setCafeDetail, setIsBookmarked, setIsCollected, userId]);

  return (
    <Head>
      <title>카페 검색 결과 상세 정보 | 카페 마스터즈 Cafe Masters</title>
      <meta
        name="description"
        content={`선택한 카페의 상세 정보를 확인하세요.`}
      />
    </Head>
  );
}
