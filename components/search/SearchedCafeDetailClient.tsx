'use client';

import { useEffect, use } from 'react';
import { useCafeStateStore, useCafeStore, useMapStore, useUIStore, useUserStore } from '@/stores';
import { IClientPage, UrlParams } from '@/types/shared/page';

/** 검색 카페 상세 페이지 클라이언트 컴포넌트
 * @param {IClientPage} props - 클라이언트 페이지 속성
 * @param {UrlParams} props.params - 파라미터
 * @returns {null} 렌더링 결과 없음, SideBar에서 카페 클릭 시 호출
 */
export default function SearchedCafeDetailClient({ params }: IClientPage) {
  const resolvedParams: UrlParams = use(params);
  const { id } = resolvedParams;
  const numericId = parseFloat(id);

  const { userId } = useUserStore();
  const { bookmarkedCafe, collectedCafe, recommendedCafe, setCafeDetail } = useCafeStore();
  const { setIsBookmarked, setIsCollected, setIsRecommended } = useCafeStateStore();
  const { setCurrentCafeId } = useMapStore();
  const { setIsLoading } = useUIStore();

  useEffect(() => {
    if (!userId) return;

    setCafeDetail({}); // 변경할 때 빈 객체로 초기화
    setCurrentCafeId(numericId);

    const isBookmarked = bookmarkedCafe.some(cafe => cafe.id === numericId);
    const isCollected = collectedCafe.some(cafe => cafe.id === numericId);
    const isRecommended = recommendedCafe.some(cafe => cafe.id === numericId);

    setIsBookmarked(isBookmarked);
    setIsCollected(isCollected);
    setIsRecommended(isRecommended);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const detailUrl = BASE_URL === 'http://localhost:3000'
      ? `/api/extra/${id}` // 로컬에서 조회
      : `/api/extra/product/${id}`; // Vercel에서 조회

    setIsLoading(true);

    const fetchDetail = async () => {
      try {
        const response = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'force-cache',
          },
        });
        const data = await response.json();
        setCafeDetail(data);
      } catch (error) {
        console.error('상세 정보 조회 중 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [
    id,
    userId,
    numericId,
    bookmarkedCafe,
    collectedCafe,
    recommendedCafe,
    setCurrentCafeId,
    setIsBookmarked,
    setIsCollected,
    setIsRecommended,
    setIsLoading,
    setCafeDetail,
  ]);

  return null;
}
