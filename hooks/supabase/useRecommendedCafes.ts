import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendedCafes, getRecommendedCafesCounts } from '@/actions/supabase/recommendation';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';

/**
 * 모든 추천 카페 조회 훅 (카테고리 필터링 포함)
 * @param selectedCategories 선택된 카테고리 배열 (선택사항)
 * @returns 추천 카페 데이터와 필터링된 데이터, 로딩 상태
 */
export function useRecommendedCafes(selectedCategories?: string[]) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: recommendedCafeQuery.all(),
    queryFn: async () => {
      const response = await getRecommendedCafes();
      return response.data;
    },
  });

  // 카테고리 필터링을 useMemo로 최적화
  const filteredRecommendedCafes = useMemo(() => {
    if (!data) return [];
    
    // selectedCategories가 없으면 원본 데이터 반환 (호환성 유지)
    if (!selectedCategories) return data;
    
    return data.filter(cafe => {
      if (!cafe.categories) return selectedCategories.length === 0;

      // 선택된 카테고리가 없으면 모든 카페를 보여줌
      if (selectedCategories.length === 0) return true;

      try {
        const parsedCategory = JSON.parse(cafe.categories) as string[];
        return selectedCategories.every(selected => parsedCategory.includes(selected));
      } catch (error) {
        console.error('카테고리 parsing error:', error);
        return false;
      }
    });
  }, [data, selectedCategories]);

  return { 
    recommendedCafes: data || [], 
    filteredRecommendedCafes, 
    isError, 
    error, 
    isLoading 
  };
}

/** 모든 추천 카페 수 조회 훅
 * @param userId 유저 ID
 * @returns 추천 카페 수
 */
export function useRecommendedCafesCounts() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: recommendedCafeQuery.counts(),
    queryFn: () => getRecommendedCafesCounts(),
  });

  return { recommendedCounts: data, isError, error, isLoading };
}