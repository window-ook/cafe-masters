'use client';

import { useQuery } from '@tanstack/react-query';
import { ISearchCafeDetail } from '@/types/kakao-map';
import { searchCafeQuery } from '@/queries/kakao-map/search';
import { fetchSearchCafeDetail } from '@/lib/data/fetchSearchCafeDetail';
import { getCafeDetail, createCafeDetail } from '@/actions/supabase/cafe-details';

/**
 * 카페 상세 정보를 다단계 캐시로 조회하는 훅
 * @description React Query 캐시 조회 → 캐시 미스시 Supabase DB 조회 → 데이터 없으면 크롤링 → Supabase 저장
 * @param cafeId 카페 ID
 * @param isEnabled 쿼리 활성화 여부
 * @returns 카페 상세 정보 데이터
 */
export function useSearchCafeDetail(cafeId: string, isEnabled: boolean = true) {
  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: searchCafeQuery.all(cafeId),
    queryFn: async (): Promise<ISearchCafeDetail> => {
      if (!cafeId || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');

      try {
        // 1단계: Supabase에서 먼저 조회해서 있으면 바로 반환
        const existingData = await getCafeDetail(cafeId);

        if (existingData) {
          const convertedData: ISearchCafeDetail = {
            image: existingData.image || '',
            extra_images: JSON.parse(existingData.extra_images || '[]'),
            opening_time: JSON.parse(existingData.opening_time || '""'),
          };

          return convertedData;
        }

        // 2단계: Supabase에 데이터가 없으면 크롤링
        const crawledData = await fetchSearchCafeDetail(cafeId);

        if (!crawledData) throw new Error('크롤링된 데이터가 없습니다.');

        // 3단계: 크롤링된 데이터를 Supabase에 저장
        try {
          await createCafeDetail(cafeId, crawledData);
          console.log(`✅ 카페 ${cafeId} 데이터 DB 저장 완료`);
        } catch (saveError) {
          console.warn(`⚠️ 카페 ${cafeId} DB 저장 실패:`, saveError);
        }

        return crawledData;
      } catch (error) {
        console.error(`❌ 카페 ${cafeId} 상세정보 조회 실패:`, error);

        if (error instanceof Error) throw error;
        throw new Error(`카페 상세정보 조회 중 알 수 없는 오류가 발생했습니다: ${String(error)}`);
      }
    },
    enabled: isEnabled && !!cafeId && cafeId.trim() !== '',
    retry: (failureCount, error) => {
      if (error instanceof Error) {
        if (error.message.includes('유효한 카페 ID') ||
          error.message.includes('로그인이 필요')) {
          return false;
        }
      }

      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    searchedCafeDetail: data,
    isError,
    error,
    isLoading,
    isFetching
  };
}