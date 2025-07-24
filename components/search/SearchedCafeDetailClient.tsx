'use client';

import { useEffect, use } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { PageProps } from 'types/common';

export default function SearchedCafeDetail({ params }: PageProps) {
  const { id } = use(params);
  const numericId = parseFloat(id);

  const userId = useUserStore(state => state.userId);
  const {
    bookmarkedCafe,
    collectedCafe,
    recommendedCafe,
    setCurrentCafeId,
    setCafeDetail,
  } = useMapStore();
  const { setIsBookmarked, setIsCollected, setIsRecommended, setIsLoading } =
    useCheckStore();

  useEffect(() => {
    if (!userId) return;

    setCafeDetail({});
    setCurrentCafeId(numericId);

    const isBookmarked = bookmarkedCafe.some(cafe => cafe.id === numericId);
    const isCollected = collectedCafe.some(cafe => cafe.id === numericId);
    const isRecommended = recommendedCafe.some(cafe => cafe.id === numericId);

    setIsBookmarked(isBookmarked);
    setIsCollected(isCollected);
    setIsRecommended(isRecommended);

    const BASE_URL = process.env.NEXT_PUBLIC_API_REQUEST_URI;
    const REQ_URL =
      BASE_URL === 'http://localhost:3000'
        ? `/api/extra/${id}`
        : `/api/extra/product/${id}`;

    setIsLoading(true);

    const fetchDetail = async () => {
      console.time(`${numericId}`);
      try {
        const response = await fetch(REQ_URL);

        const data = await response.json();
        console.timeEnd(`${numericId}`);

        setCafeDetail(data);
      } catch (error) {
        console.error('검색 결과 상세 정보 error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [
    id,
    userId,
    numericId,
    bookmarkedCafe,
    collectedCafe,
    recommendedCafe,
    setCurrentCafeId,
    setIsBookmarked,
    setIsCollected,
    setIsRecommended,
    setIsLoading,
    setCafeDetail,
  ]);

  return null;
}
