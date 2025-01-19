'use client';

import { useEffect, use } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { getCafeDetail } from 'actions/cafeDetailActions';
import { getBookmarkedCafe } from 'actions/bookmarkActions';
import { getCollectedCafe } from 'actions/collectActions';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function AllDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const userId = useUserStore(state => state.userId);
  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const collectedCafe = useMapStore(state => state.collectedCafe);
  const setCafeDetail = useMapStore(state => state.setCafeDetail);
  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);
  const setIsCollected = useCheckStore(state => state.setIsCollected);
  const setIsLoading = useCheckStore(state => state.setIsLoading);

  useEffect(() => {
    if (!userId || userId === 'no-user') return;

    setIsBookmarked(false);
    setIsCollected(false);
    setIsLoading(true);

    const fetchAllData = async () => {
      try {
        const numericId = parseFloat(id);

        const cafeDetailResponse = await getCafeDetail(id);
        const isBookmarkedLocally = bookmarkedCafe.some(
          cafe => cafe.id === numericId,
        );
        const isCollectedLocally = collectedCafe.some(
          cafe => cafe.id === numericId,
        );
        setCafeDetail(cafeDetailResponse);
        setIsBookmarked(isBookmarkedLocally);
        setIsCollected(isCollectedLocally);

        const [isBookmarkedResponse, isCollectedResponse] = await Promise.all([
          !isBookmarkedLocally
            ? getBookmarkedCafe(numericId, userId)
            : Promise.resolve(null),
          !isCollectedLocally
            ? getCollectedCafe(numericId, userId)
            : Promise.resolve(null),
        ]);

        if (isBookmarkedResponse?.length) {
          setIsBookmarked(true);
          console.log('북마크 확인 요청 발생');
        }

        if (isCollectedResponse?.length) {
          setIsCollected(true);
          console.log('수집한 카드 확인 요청 발생');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [
    id,
    userId,
    bookmarkedCafe,
    collectedCafe,
    setCafeDetail,
    setIsBookmarked,
    setIsCollected,
    setIsLoading,
  ]);

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
