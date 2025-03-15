'use client';

import { useEffect, use, useMemo } from 'react';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { getCollectedCafe } from 'actions/collectActions';
import { getBookmarkedCafe } from 'actions/bookmarkActions';
import { PageProps } from 'types/common';
import Head from 'next/head';

export default function SearchDetail({ params }: PageProps) {
  const { id } = use(params);

  const numericId = useMemo(() => parseFloat(id), [id]);
  const BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_REQUEST_URI, []);

  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const collectedCafe = useMapStore(state => state.collectedCafe);
  const setThisId = useMapStore(state => state.setThisId);
  const setCafeDetail = useMapStore(state => state.setCafeDetail);

  const userId = useUserStore(state => state.userId);

  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);
  const setIsCollected = useCheckStore(state => state.setIsCollected);
  const setIsLoading = useCheckStore(state => state.setIsLoading);

  useEffect(() => {
    if (!userId || userId === '') return;

    setIsLoading(true);
    setIsBookmarked(false);
    setIsCollected(false);

    const fetchSearchData = async () => {
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
      }
    };

    const fetchCafeDetail = async () => {
      if (!BASE_URL) {
        console.error('환경 변수가 설정되지 않았습니다.');
        return;
      }

      const REQ_URL =
        BASE_URL === 'http://localhost:3000'
          ? `/api/extra/${id}`
          : `/api/extra/product/${id}`;

      try {
        const response = await fetch(REQ_URL);
        const data = await response.json();
        setCafeDetail(data);
      } catch (error) {
        console.error('상세 정보 다운로드 에러:', error);
      }
    };

    Promise.all([fetchCafeDetail(), fetchSearchData()]).finally(() =>
      setIsLoading(false),
    );
  }, [
    id,
    userId,
    bookmarkedCafe,
    collectedCafe,
    setThisId,
    setIsBookmarked,
    setIsCollected,
    setIsLoading,
    setCafeDetail,
    numericId,
    BASE_URL,
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
