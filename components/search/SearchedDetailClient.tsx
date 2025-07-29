'use client';

import { useEffect, use } from 'react';
import { useMapStore, useUserStore } from '@/stores';
import { useBookmarkedCafes } from '@/hooks/supabase/bookmark/useBookmarkedCafes';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';

/** 검색 카페 상세 페이지 클라이언트 컴포넌트
 * @description 카페 ID 동기화 / 북마크, 수집, 추천된 건지 확인하고 상태 업데이트
 */
export default function SearchedDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const numericId = Number(id);

  const userId = useUserStore(state => state.userId);
  const setIsBookmarked = useMapStore(state => state.setIsBookmarked);
  const setIsCollected = useMapStore(state => state.setIsCollected);
  const setIsRecommended = useMapStore(state => state.setIsRecommended);
  const setCurrentCafeId = useMapStore(state => state.setCurrentCafeId);

  const { collectedCafes } = useCollectedCafes(userId, true);
  const { bookmarkedCafes } = useBookmarkedCafes(userId);
  const { recommendedCafes } = useRecommendedCafes();

  // 카페 ID 설정 - 페이지 로드시 1회만 실행
  useEffect(() => {
    if (!numericId) return;
    setCurrentCafeId(numericId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 카페 상태 업데이트 - 의존성이 변경될 때마다 실행하되, 중복 실행 방지
  useEffect(() => {
    if (!numericId) return;

    // 현재 상태와 비교하여 실제 변경이 있을 때만 업데이트
    const isCollected = collectedCafes.some(cafe => cafe.id === numericId);
    const isBookmarked = bookmarkedCafes.some(cafe => cafe.id === numericId);
    const isRecommended = recommendedCafes?.some(cafe => cafe.id === numericId) || false;

    // 배치 업데이트로 한 번에 처리
    const updateStates = () => {
      setIsCollected(isCollected);
      setIsBookmarked(isBookmarked);
      setIsRecommended(isRecommended);
    };

    // setTimeout을 사용하여 중복 호출 방지
    const timeoutId = setTimeout(updateStates, 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId, bookmarkedCafes, collectedCafes, recommendedCafes]);

  return null;
}
