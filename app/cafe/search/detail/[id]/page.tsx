'use client';

import { useEffect, use, useMemo } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function SearchDetail({ params }: PageProps) {
  const { id } = use(params);

  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const collectedCafe = useMapStore(state => state.collectedCafe);
  const setThisId = useMapStore(state => state.setThisId);
  const setCafeDetail = useMapStore(state => state.setCafeDetail);
  const userId = useUserStore(state => state.userId);
  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);
  const setIsCollected = useCheckStore(state => state.setIsCollected);
  const setIsLoading = useCheckStore(state => state.setIsLoading);

  const numericId = useMemo(() => parseFloat(id), [id]);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_REQUEST_URI, []);

  const REQ_URL =
    BASE_URL === 'http://localhost:3000'
      ? `/api/extra/${id}`
      : `/api/extra/product/${id}`;

  useEffect(() => {
    if (!userId || userId === '') return;

    setIsLoading(true);
    setIsBookmarked(false);
    setIsCollected(false);

    const fetchFromStore = async () => {
      try {
        setThisId(numericId);

        const isBookmarkedLocally = bookmarkedCafe.some(
          cafe => cafe.id === numericId,
        );
        const isCollectedLocally = collectedCafe.some(
          cafe => cafe.id === numericId,
        );
        setIsBookmarked(isBookmarkedLocally);
        setIsCollected(isCollectedLocally);
        // setIsRecommended() 추가하기
      } catch (error) {
        console.error('수집한 카페와 북마크한 카페 중에서 찾지 못함:', error);
      }
    };

    const fetchCafeDetail = async () => {
      if (!BASE_URL) return;

      try {
        const response = await fetch(REQ_URL);
        const data = await response.json();
        setCafeDetail(data);
      } catch (error) {
        console.error('카페 상세 정보 다운로드 에러:', error);
      }
    };

    Promise.all([fetchCafeDetail(), fetchFromStore()]).finally(() =>
      setIsLoading(false),
    );
  }, [
    id,
    userId,
    numericId,
    bookmarkedCafe,
    collectedCafe,
    BASE_URL,
    REQ_URL,
    setThisId,
    setIsBookmarked,
    setIsCollected,
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
