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
        // 1단계: Supabase 조회
        const existingData = await getCafeDetail(cafeId);

        if (existingData) {
          const convertedData: ISearchCafeDetail = {
            image: existingData.image || '',
            extra_images: JSON.parse(existingData.extra_images || '[]'),
            opening_time: existingData.opening_time || '',
          };

          return convertedData;
        }

        // 2단계: Supabase에 없으면 크롤링
        console.log(`🔍 ${cafeId} DB에 없음`);
        const scrapedData = await fetchSearchCafeDetail(cafeId);

        if (!scrapedData) throw new Error('크롤링된 데이터가 없습니다.');

        const isValidData = scrapedData.image && scrapedData.image.trim() !== '';

        // 3단계: 유효한 데이터만 Supabase에 저장
        if (isValidData) {
          try {
            await createCafeDetail(cafeId, scrapedData);
            console.log(`✅ ${cafeId} DB 저장 완료`);
          } catch (saveError) {
            console.warn(`⚠️ ${cafeId} DB 저장 실패:`, saveError);
          }
        } else {
          console.warn(`⚠️ ${cafeId} DB 저장 생략`);
        }

        return scrapedData;
      } catch (error) {
        console.error(`❌ ${cafeId} 상세 정보 조회 실패:`, error);

        if (error instanceof Error) throw error;
        throw new Error(`카페 상세 정보 조회 중 알 수 없는 에러가 발생했습니다: ${String(error)}`);
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
    retryDelay: (attemptIndex) => Math.min(500 * attemptIndex, 2000),
  });

  return {
    searchedCafeDetail: data,
    isError,
    error,
    isLoading,
    isFetching
  };
}