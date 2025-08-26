'use client';

import { useEffect, use } from 'react';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { useBookmarkCafes } from '@/hooks/supabase/bookmark';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';

interface ISearchDetailClientProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** 검색 카페 상세 페이지 클라이언트 컴포넌트
 * @description 카페 ID 동기화 / 북마크, 수집, 추천된 건지 확인하고 상태 업데이트
 */
export default function SearchDetailClient({ params }: ISearchDetailClientProps) {
  const resolvedParams = use(params);

  const { id } = resolvedParams;
  const numericId = Number(id);

  const userId = useUserStore(state => state.userId);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);
  const setIsCollected = useCurrentCafeStore(state => state.setIsCollected);
  const setIsRecommended = useCurrentCafeStore(state => state.setIsRecommended);
  const setCurrentCafeId = useCurrentCafeStore(state => state.setCurrentCafeId);

  const { collectionCafes } = useCollectionCafes(userId, 1, 8, true);
  const { bookmarkCafes } = useBookmarkCafes(userId);
  const { recommendationCafes } = useRecommendationCafes();

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
    const isCollected = collectionCafes.some(cafe => cafe.id === numericId);
    const isBookmarked = bookmarkCafes.some(cafe => cafe.id === numericId);
    const isRecommended = recommendationCafes?.some(cafe => cafe.id === numericId) || false;

    const updateStates = () => {
      setIsCollected(isCollected);
      setIsBookmarked(isBookmarked);
      setIsRecommended(isRecommended);
    };

    // 중복 호출 방지
    const timeoutId = setTimeout(updateStates, 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId, bookmarkCafes, collectionCafes, recommendationCafes]);

  return null;
}
