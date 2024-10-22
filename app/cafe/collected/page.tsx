'use client';

import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { countCollected, getAllCollected } from 'actions/collectedActions';

export default function CollectedPage() {
  const userId = useUserStore((state) => state.userId);
  const setCollectedCafe = useMapStore((state) => state.setCollectedCafe);
  const setCollectedCafeCount = useMapStore(
    (state) => state.setCollectedCafeCount
  );

  const collectedResult = useQuery({
    queryKey: ['collectedCafe', userId],
    queryFn: async () => {
      const response = await getAllCollected(userId);
      setCollectedCafe(response);
      return response;
    },
    onSuccess: (data) => {
      console.log('수집한 카드들:', data);
    },
    onError: (error) =>
      console.error('수집한 카드 데이터 다운로드 에러: ', error),
    enabled: !!userId,
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 5,
  });

  const collectedCountResult = useQuery({
    queryKey: ['collectedCafeCount', userId],
    queryFn: async () => {
      const response = await countCollected(userId);
      setCollectedCafeCount(response?.count || 0);
      return response;
    },
    onSuccess: (data) => {
      console.log('수집한 카드의 수:', data);
    },
    onError: (error) =>
      console.error('수집한 카드 수 데이터 다운로드 에러: ', error),
    enabled: !!userId,
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 5,
  });

  if (collectedResult && collectedCountResult)
    console.log('수집한 카드 : SUCCESS');

  return null;
}
