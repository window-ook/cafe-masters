import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  CollectedRowInsert,
  createCollectedCafe,
} from 'actions/collectActions';

export function useUploadCollectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memo: CollectedRowInsert) =>
      await createCollectedCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe'] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe'] });
    },
    onError: error => console.error(error),
  });
}
