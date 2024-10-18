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

  const { data: collectedResponse, isLoading: isCollectedLoading } = useQuery({
    queryKey: ['collectedCafe', userId],
    queryFn: async () => await getAllCollected(userId),
    onSuccess: (data) => setCollectedCafe(data),
    enabled: !!userId,
    staleTime: 1000 * 6 * 5,
  });

  const { data: countResponse, isLoading: isCountLoading } = useQuery({
    queryKey: ['collectedCafeCount', userId],
    queryFn: async () => await countCollected(userId),
    onSuccess: (data) => setCollectedCafeCount(data?.count || 0),
    enabled: !!userId,
    staleTime: 1000 * 6 * 5,
  });

  return null;
}
