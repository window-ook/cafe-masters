import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  RecommendationRowInsert,
  createRecommendedCafe,
} from '@/actions/supabase/recommendation';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';

/** 추천 카페 추가 훅 */
export function useUploadRecommendedCafe() {
  const queryClient = useQueryClient();

  const uploadRecommended = useMutation({
    mutationFn: async (memo: RecommendationRowInsert) => await createRecommendedCafe(memo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recommendedCafeQuery.all() }),
    onError: error => console.error(error),
  });

  return { uploadRecommendedCafe: uploadRecommended.mutate };
}