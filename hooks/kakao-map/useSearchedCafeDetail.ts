'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ISearchedCafeDetail } from '@/types/kakao-map/kakao-map';

/** 검색된 카페 상세 정보 조회 훅
 * @param cafeId 카페 ID
 * @returns 카페 상세 정보 데이터
 */
export function useSearchedCafeDetail(cafeId: string) {
  const { data, isError, error } = useSuspenseQuery({
    queryKey: ['searchedCafeDetail', cafeId],
    queryFn: async (): Promise<ISearchedCafeDetail> => {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const detailUrl = BASE_URL === 'http://localhost:3000'
        ? `/api/cafe-detail/${cafeId}` // 로컬에서 조회
        : `/api/cafe-detail/product/${cafeId}`; // Vercel에서 조회

      const response = await fetch(detailUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`카페 상세 정보를 불러올 수 없습니다: ${response.status}`);

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      return {
        image: data.image || null,
        extra_images: Array.isArray(data.extra_images) ? data.extra_images : [],
        opening_time: data.opening_time || '',
        menus: Array.isArray(data.menus) ? data.menus : [],
      };
    },
  });

  return { searchedCafeDetail: data, isError, error };
}