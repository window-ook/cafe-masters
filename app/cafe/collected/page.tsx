'use client';
import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { countCollected, getAllCollected } from 'actions/collectedActions';
import { CollectedCafe, CollectedCount } from 'types/types';

export default function CollectedPage() {
  const userId = useUserStore((state) => state.userId);
  const setCollectedCafe = useMapStore((state) => state.setCollectedCafe);
  const setCollectedCafeCount = useMapStore(
    (state) => state.setCollectedCafeCount
  );

  const queryFnData = async () => {
    const response = await getAllCollected(userId);
    setCollectedCafe(response);
    return response;
  };

  const queryFnCount = async () => {
    const response = await countCollected(userId);
    setCollectedCafeCount(response?.count || 0);
    return response;
  };

  const optionsData = {
    queryKey: ['collectedCafe', userId],
    queryFn: queryFnData,
    enabled: !!userId,
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 5,
    onSuccess: (data: CollectedCafe[]) => console.log('수집한 카드:', data),
    onError: (error: Error) =>
      console.error('수집한 카드 데이터 다운로드 에러: ', error),
  };

  const optionsCount = {
    queryKey: ['collectedCafeCount', userId],
    queryFn: queryFnCount,
    enabled: !!userId,
    staleTime: 1000 * 60 * 3,
    cacheTime: 1000 * 60 * 5,
    onSuccess: (data: CollectedCount) => console.log('수집한 카드 수:', data),
    onError: (error: Error) =>
      console.error('수집한 카드 수 데이터 다운로드 에러: ', error),
  };

  const collectedCafe = useQuery<CollectedCafe[], Error, string[]>(optionsData);
  const collectedCafeCount = useQuery<CollectedCount, Error, string[]>(
    optionsCount
  );

  if (collectedCafe && collectedCafeCount) console.log('수집한 카드 : SUCCESS');
  return null;
}
