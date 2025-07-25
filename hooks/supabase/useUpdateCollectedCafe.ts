import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCafeStore, useUserStore } from '@/stores';
import {
  CollectedRowUpdate,
  updateCollectedCafe,
} from '@/actions/supabase/collection';

export function useUpdateCollectedCafe() {
  const userId = useUserStore(state => state.userId);

  const queryClient = useQueryClient();

  const collectedCafeDetail = useCafeStore(
    state => state.collectedCafeDetail[0],
  );

  return useMutation({
    mutationFn: async (memo: CollectedRowUpdate) =>
      await updateCollectedCafe(memo, collectedCafeDetail.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
    },
    onError: error => console.error(error),
  });
}
