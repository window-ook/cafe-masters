'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import {
  getAllCollectedCafes,
  countCollectedCafes,
} from 'actions/collectActions';
import Head from 'next/head';

export default function CollectedPage() {
  const userId = useUserStore(state => state.userId);
  const setCollectedCafe = useMapStore(state => state.setCollectedCafe);
  const setCollectedCafeCount = useMapStore(
    state => state.setCollectedCafeCount,
  );

  const collectedCafeQuery = useQuery({
    queryKey: ['collectedCafe', userId],
    queryFn: async () => {
      const response = await getAllCollectedCafes(userId);
      return response;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  const collectedCafeCountQuery = useQuery({
    queryKey: ['collectedCafeCount', userId],
    queryFn: async () => {
      const response = await countCollectedCafes(userId);
      return response?.count || 0;
    },
    enabled: !!userId && userId !== 'no-user',
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (collectedCafeQuery.isSuccess) setCollectedCafe(collectedCafeQuery.data);
  }, [collectedCafeQuery.isSuccess, collectedCafeQuery.data, setCollectedCafe]);

  useEffect(() => {
    if (collectedCafeCountQuery.isSuccess)
      setCollectedCafeCount(collectedCafeCountQuery.data);
  }, [
    collectedCafeCountQuery.isSuccess,
    collectedCafeCountQuery.data,
    setCollectedCafeCount,
  ]);

  useEffect(() => {
    if (collectedCafeQuery.isError) {
      console.error(
        '수집한 카드 데이터 다운로드 에러: ',
        collectedCafeQuery.error,
      );
    }
  }, [collectedCafeQuery.isError, collectedCafeQuery.error]);

  useEffect(() => {
    if (collectedCafeCountQuery.isError) {
      console.error(
        '수집한 카드 수 데이터 다운로드 에러: ',
        collectedCafeCountQuery.error,
      );
    }
  }, [collectedCafeCountQuery.isError, collectedCafeCountQuery.error]);

  return (
    <Head>
      <title>수집한 카드 | Cafe Masters</title>
      <meta name="description" content={`내가 수집한 카드들을 볼 수 있어요.`} />
    </Head>
  );
}
