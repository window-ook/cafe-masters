'use client';

import { useEffect } from 'react';
import {
  useCurrentCafeStore,
  useSearchedResultStore,
  useUIStore,
  useUserStore,
} from '@/stores';
import { useBookmarkCafes } from '@/hooks/supabase/bookmark';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

export interface ISearchDetailClient {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

/** 검색 카페 상세 페이지 클라이언트 컴포넌트
 * @description 카페 ID 동기화 / 북마크, 수집, 추천된 건지 확인하고 상태 업데이트 / URL 직접 접근 시 카페 기본 정보 조회
 */
export default function SearchDetailClient({
  params,
  searchParams,
}: ISearchDetailClient) {
  const { id } = params;
  const numericId = Number(id);

  const userId = useUserStore(state => state.userId);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const setSearchResult = useSearchedResultStore(
    state => state.setSearchResult,
  );
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);
  const setIsCollected = useCurrentCafeStore(state => state.setIsCollected);
  const setIsRecommended = useCurrentCafeStore(state => state.setIsRecommended);
  const setCurrentCafeId = useCurrentCafeStore(state => state.setCurrentCafeId);
  const setCurrentCoordX = useCurrentCafeStore(state => state.setCurrentCoordX);
  const setCurrentCoordY = useCurrentCafeStore(state => state.setCurrentCoordY);
  const openCafeDetail = useUIStore(state => state.openCafeDetail);

  const { collectionCafes } = useCollectionCafes(userId, 1, 8, true);
  const { bookmarkCafes } = useBookmarkCafes(userId);
  const { recommendationCafes } = useRecommendationCafes();

  // 카페 ID 설정 - 페이지 로드시 1회만 실행
  useEffect(() => {
    if (!numericId) return;
    setCurrentCafeId(numericId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL 직접 접근 시 카카오맵 API로 검색
  useEffect(() => {
    const foundCafe = searchResult?.find(cafe => Number(cafe.id) === numericId);

    if (foundCafe) {
      openCafeDetail(numericId);
      return;
    }

    const cafeName = searchParams?.name as string | undefined;
    if (!cafeName) return;

    const loadKakaoPlaceInfo = () => {
      if (!window.kakao?.maps?.services) {
        setTimeout(loadKakaoPlaceInfo, 100);
        return;
      }

      const ps = new window.kakao.maps.services.Places();

      // keywordSearch로 카페 이름으로 검색
      ps.keywordSearch(cafeName, (data: any, status: any) => {
        if (
          status === window.kakao.maps.services.Status.OK &&
          data.length > 0
        ) {
          const matchedCafe = data.find((place: any) => place.id === id);

          if (matchedCafe) {
            const cafeInfo = {
              id: matchedCafe.id,
              place_name: matchedCafe.place_name,
              category_group_code: matchedCafe.category_group_code || '',
              category_group_name: matchedCafe.category_group_name || '',
              category_name: matchedCafe.category_name,
              phone: matchedCafe.phone || '',
              address_name: matchedCafe.address_name,
              road_address_name: matchedCafe.road_address_name,
              distance: matchedCafe.distance || '0',
              x: parseFloat(matchedCafe.x),
              y: parseFloat(matchedCafe.y),
              place_url: matchedCafe.place_url,
            };

            setSearchResult([cafeInfo]);
            setCurrentCoordX(parseFloat(matchedCafe.x));
            setCurrentCoordY(parseFloat(matchedCafe.y));
            openCafeDetail(numericId);
          }
        }
      });
    };

    loadKakaoPlaceInfo();
  }, [
    id,
    numericId,
    searchParams,
    searchResult,
    setSearchResult,
    setCurrentCoordX,
    setCurrentCoordY,
    openCafeDetail,
  ]);

  // 카페 상태 업데이트 - 의존성이 변경될 때마다 실행하되, 중복 실행 방지
  useEffect(() => {
    if (!numericId) return;

    const isCollected = collectionCafes.some(cafe => cafe.id === numericId);
    const isBookmarked = bookmarkCafes.some(cafe => cafe.id === numericId);
    const isRecommended =
      recommendationCafes?.some(cafe => cafe.id === numericId) || false;

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
