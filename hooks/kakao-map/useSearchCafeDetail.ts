'use client';

import { useQuery } from '@tanstack/react-query';
import { getCafeDetail, createCafeDetail } from '@/actions/supabase/cafe-details';
import { fetchSearchCafeDetail } from '@/lib/data/fetchSearchCafeDetail';
import { searchCafeQuery } from '@/queries/kakao-map/search';
import { IMAGE_PATHS } from '@/lib/paths';
import { ISearchCafeDetail } from '@/types/kakao-map';

/**
 * 카페 상세 정보를 조회하는 훅
 * @description
 * - 로컬: React Query 캐시 조회 →(실패 시) Supabase DB 조회 →(실패 시) 스크래핑 → DB 저장 및 캐싱
 * - Vercel: React Query 캐시 조회 →(실패 시) Supabase DB 조회 → 실패시 fallback 이미지 반환 및 캐싱
 * @param cafeId 카페 ID
 * @param isEnabled 쿼리 활성화 여부
 * @returns 카페 상세 정보 데이터
 */
export function useSearchCafeDetail(cafeId: string, isEnabled: boolean = true) {
  const { data, isError, error, isPending, isFetching } = useQuery({
    queryKey: searchCafeQuery.all(cafeId),
    queryFn: async (): Promise<ISearchCafeDetail> => {
      if (!cafeId || cafeId.trim() === '') throw new Error('유효한 카페 ID가 필요합니다.');

      const isLocalEnvironment = process.env.NEXT_PUBLIC_BASE_URL === 'http://localhost:3000';

      try {
        // 1단계: Supabase 조회
        const existingData = await getCafeDetail(cafeId);

        if (existingData) {
          console.log(`✅ ${cafeId} DB 조회`);
          const convertedData: ISearchCafeDetail = {
            image: existingData.image || '',
            extra_images: JSON.parse(existingData.extra_images || '[]'),
            opening_time: existingData.opening_time || '',
          };

          return convertedData;
        }

        console.log(`🔍 ${cafeId} DB에 존재하지 않음`);

        // 2단계: 환경별 처리 분기
        if (isLocalEnvironment) {
          const scrapedData = await fetchSearchCafeDetail(cafeId);

          if (!scrapedData) throw new Error('스크래핑된 데이터가 없습니다.');

          const isValidData = scrapedData.image && scrapedData.image.trim() !== '';

          if (isValidData) {
            try {
              await createCafeDetail(cafeId, scrapedData);
              console.log(`✅ ${cafeId} DB 저장`);
            } catch (saveError) {
              console.warn(`⚠️ ${cafeId} DB 저장 에러:`, saveError);
            }
          } else {
            console.warn(`⚠️ ${cafeId} DB 저장 생략`);
          }

          return scrapedData;
        } else {
          const fallbackImages = Object.values(IMAGE_PATHS.FALLBACK_THUMBNAILS);
          const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

          const fallbackData: ISearchCafeDetail = {
            image: randomImage,
            extra_images: [],
            opening_time: '',
          };

          return fallbackData;
        }
      } catch (error) {
        if (!isLocalEnvironment) {
          const fallbackImages = Object.values(IMAGE_PATHS.FALLBACK_THUMBNAILS);
          const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

          const fallbackData: ISearchCafeDetail = {
            image: randomImage,
            extra_images: [],
            opening_time: '',
          };

          return fallbackData;
        }

        if (error instanceof Error) throw error;
        throw new Error(`카페 상세 정보 조회 중 알 수 없는 에러가 발생했습니다: ${String(error)}`);
      }
    },
    enabled: isEnabled && !!cafeId && cafeId.trim() !== '',
    retry: (failureCount, error) => {
      const isLocalEnvironment = process.env.NEXT_PUBLIC_BASE_URL === 'http://localhost:3000';

      if (!isLocalEnvironment) return false;

      if (error instanceof Error) {
        if (error.message.includes('유효한 카페 ID') || error.message.includes('로그인이 필요')) return false;
      }

      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(500 * attemptIndex, 2000),
  });

  return {
    searchedCafeDetail: data,
    isError,
    error,
    isPending,
    isFetching
  };
}