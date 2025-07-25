import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import {
  CollectedRowInsert,
  createCollectedCafe,
} from '@/actions/supabase/collection';

export function useUploadCollectedCafe() {
  const userId = useUserStore(state => state.userId);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memo: CollectedRowInsert) =>
      await createCollectedCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
    },
    onError: error => console.error(error),
  });
}
