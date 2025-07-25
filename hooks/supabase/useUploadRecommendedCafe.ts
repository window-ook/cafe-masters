import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  RecommendationRowInsert,
  createRecommendedCafe,
} from '@/actions/supabase/recommendation';
import { recommendedCafeQuery } from '@/queries/supabase/recommendation';

export function useUploadRecommendedCafe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memo: RecommendationRowInsert) =>
      await createRecommendedCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendedCafeQuery.all() });
      queryClient.refetchQueries({ queryKey: recommendedCafeQuery.all() });
    },
    onError: error => console.error(error),
  });
}
