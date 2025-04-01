import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  RecommendedRowInsert,
  createRecommendedCafe,
} from 'actions/recommendActions';

export function useUploadRecommendMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memo: RecommendedRowInsert) =>
      await createRecommendedCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendedCafe'] });
      queryClient.refetchQueries({ queryKey: ['recommendedCafe'] });
    },
    onError: error => console.error(error),
  });
}
