import { useEffect } from 'react';
import { useCafeStore, useCafeStateStore } from '@/stores';

export default function useCafeDetailState(
  id: string,
  type: 'bookmarked' | 'recommended',
) {
  const numericId = parseFloat(id);

  const { setIsBookmarked, setIsCollected } = useCafeStateStore();
  const {
    bookmarkedCafe,
    collectedCafe,
    recommendedCafe,
    setBookmarkedCafeDetail,
    setRecommendedCafeDetail,
  } = useCafeStore();

  useEffect(() => {
    const isCollected = collectedCafe.some(c => c.id === numericId);
    const isBookmarked = bookmarkedCafe.some(c => c.id === numericId);

    setIsCollected(isCollected);
    setIsBookmarked(isBookmarked);

    if (type === 'bookmarked') {
      const target = bookmarkedCafe.find(c => c.id === numericId);
      if (target) setBookmarkedCafeDetail([target]);
    } else if (type === 'recommended') {
      const target = recommendedCafe.find(c => c.id === numericId);
      if (target) setRecommendedCafeDetail([target]);
    }
  }, [
    numericId,
    bookmarkedCafe,
    collectedCafe,
    recommendedCafe,
    id,
    setIsCollected,
    setIsBookmarked,
    type,
    setBookmarkedCafeDetail,
    setRecommendedCafeDetail,
  ]);
}
