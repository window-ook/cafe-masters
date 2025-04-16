'use client';

import { useEffect, use } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function SearchDetailUI({ params }: PageProps) {
  const { id } = use(params);
  const numericId = parseFloat(id);

  const {
    bookmarkedCafe,
    collectedCafe,
    recommendedCafe,
    setCurrentCafeId,
    setCafeDetail,
  } = useMapStore();
  const userId = useUserStore(state => state.userId);
  const { setIsBookmarked, setIsCollected, setIsRecommended, setIsLoading } =
    useCheckStore();

  useEffect(() => {
    if (!userId || userId === '') return;

    const BASE_URL = process.env.NEXT_PUBLIC_API_REQUEST_URI;

    const REQ_URL =
      BASE_URL === 'http://localhost:3000'
        ? `/api/extra/${id}`
        : `/api/extra/product/${id}`;

    const fetchData = async () => {
      setIsLoading(true);
      setIsBookmarked(false);
      setIsCollected(false);
      setIsRecommended(false);

      try {
        const response = await fetch(REQ_URL);
        const data = await response.json();
        setCafeDetail(data);
        setCurrentCafeId(numericId);
        setIsBookmarked(bookmarkedCafe.some(cafe => cafe.id === numericId));
        setIsCollected(collectedCafe.some(cafe => cafe.id === numericId));
        setIsRecommended(recommendedCafe.some(cafe => cafe.id === numericId));
      } catch (error) {
        console.error('검색 결과 상세 정보 error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  return (
    <Head>
      <title>카페 검색 결과 상세 정보 | Cafe Masters</title>
      <meta
        name="description"
        content={`검색 결과의 상세 정보를 확인하세요.`}
      />
    </Head>
  );
}
