'use client';

import { useEffect, use } from 'react';
import { useCurrentCafeStore, useMapStore, useUserStore } from '@/stores';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';

/** 검색 카페 상세 페이지 클라이언트 컴포넌트
 * @description 카페 ID 동기화 / 북마크, 수집, 추천된 건지 확인하고 상태 업데이트
 */
export default function SearchedCafeDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const numericId = Number(id);

  const { userId } = useUserStore();
  const { collectedCafes } = useCollectedCafes(userId, true);
  const { bookmarkedCafes } = useBookmarkedCafes(userId);
  const { recommendedCafes } = useRecommendedCafes();
  const { setIsBookmarked, setIsCollected, setIsRecommended } = useCurrentCafeStore();
  const { setCurrentCafeId } = useMapStore();

  useEffect(() => {
    setCurrentCafeId(numericId);

    const isCollected = collectedCafes.some(cafe => cafe.id === numericId);
    const isBookmarked = bookmarkedCafes.some(cafe => cafe.id === numericId);
    const isRecommended = recommendedCafes?.some(cafe => cafe.id === numericId);

    setIsCollected(isCollected);
    setIsBookmarked(isBookmarked);
    setIsRecommended(isRecommended || false);
  }, [numericId, bookmarkedCafes, collectedCafes, recommendedCafes, setCurrentCafeId, setIsBookmarked, setIsCollected, setIsRecommended]);

  return null;
}
