'use client';

import { useEffect, use, useMemo } from 'react';
import { useCheckStore, useMapStore } from 'utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function RecommendedDetail({ params }: PageProps) {
  const { id } = use(params);

  const collectedCafe = useMapStore(state => state.collectedCafe);
  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const recommendedCafe = useMapStore(state => state.recommendedCafe);
  const setRecommendedCafeDetail = useMapStore(
    state => state.setRecommendedCafeDetail,
  );
  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);
  const setIsCollected = useCheckStore(state => state.setIsCollected);

  const numericId = useMemo(() => parseFloat(id), [id]);

  useEffect(() => {
    setIsBookmarked(false);
    setIsCollected(false);

    const fetchFromStore = async () => {
      try {
        const targetCafe = recommendedCafe.find(cafe => cafe.id === numericId);
        const isBookmarkedLocally = bookmarkedCafe.some(
          cafe => cafe.id === numericId,
        );
        const isCollectedLocally = collectedCafe.some(
          cafe => cafe.id === numericId,
        );
        if (targetCafe) setRecommendedCafeDetail([targetCafe]);
        setIsCollected(isCollectedLocally);
        setIsBookmarked(isBookmarkedLocally);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFromStore();
  }, [
    numericId,
    bookmarkedCafe,
    id,
    recommendedCafe,
    setIsBookmarked,
    setRecommendedCafeDetail,
    collectedCafe,
    setIsCollected,
  ]);

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
