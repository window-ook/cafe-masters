'use client';

import { useQuery } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { getAllBookmarked } from 'actions/bookmarkActions';

export default function BookmarkedPage() {
  const userId = useUserStore((state) => state.userId);
  const setBookmarkedCafe = useMapStore((state) => state.setBookmarkedCafe);

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarkedCafe', userId],
    queryFn: async () => await getAllBookmarked(userId),
    onSuccess: (data) => setBookmarkedCafe(data),
    enabled: !!userId,
    staleTime: 1000 * 6 * 5,
  });

  return;
}
