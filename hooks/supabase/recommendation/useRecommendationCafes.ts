import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecommendationCafes } from '@/actions/supabase/recommendation';
import { recommendationCafeQuery } from '@/queries/supabase/recommendation';

/**
 * 카테고리 필터링 포함 추천 카페 조회 훅
 * @param selectedCategories 선택된 카테고리 배열 (선택사항)
 * @returns 추천 카페 데이터와 필터링된 데이터, 로딩 상태
 */
export function useRecommendationCafes(selectedCategories?: string[]) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: recommendationCafeQuery.all(),
    queryFn: async () => {
      const response = await getRecommendationCafes();
      return response.data;
    },
  });

  const filteredRecommendationCafes = useMemo(() => {
    if (!data) return [];

    // selectedCategories가 없으면 원본 데이터 반환
    if (!selectedCategories) return data;

    return data.filter(cafe => {
      if (!cafe.categories) return selectedCategories.length === 0;

      // 선택된 카테고리가 없으면 모든 카페를 보여줌
      if (selectedCategories.length === 0) return true;

      try {
        const parsedCategory = cafe.categories;
        return selectedCategories.every(selected => parsedCategory.includes(selected));
      } catch (error) {
        console.error('카테고리 파싱 중 에러:', error);
        return false;
      }
    });
  }, [data, selectedCategories]);

  const totalFilteredCount = filteredRecommendationCafes.length;

  return {
    recommendationCafes: data || [],
    filteredRecommendationCafes,
    totalFilteredCount,
    isError,
    error,
    isLoading
  };
}