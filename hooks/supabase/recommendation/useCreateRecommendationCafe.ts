import { useQueryClient, useMutation } from '@tanstack/react-query';
import { RecommendationRowInsert, createRecommendationCafe, } from '@/actions/supabase/recommendation';
import { recommendationCafeQuery } from '@/queries/supabase/recommendation';

/** 추천 카페 추가 훅 */
export function useCreateRecommendationCafe() {
  const queryClient = useQueryClient();

  const createRecommendation = useMutation({
    mutationFn: async (memo: RecommendationRowInsert) => await createRecommendationCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationCafeQuery.all() });
      queryClient.invalidateQueries({ queryKey: recommendationCafeQuery.counts() });
    },
    onError: error => console.error(error),
  });

  return { createRecommendationCafe: createRecommendation.mutateAsync };
}