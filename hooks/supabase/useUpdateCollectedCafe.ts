import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useMapStore, useUserStore } from '@/stores';
import {
  CollectedRowUpdate,
  updateCollectedCafe,
} from '@/actions/supabase/collection';

export function useUpdateCollectedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();
  const { currentCafeId } = useMapStore();

  return useMutation({
    mutationFn: async (memo: CollectedRowUpdate) => await updateCollectedCafe(memo, currentCafeId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
    },
    onError: error => console.error(error),
  });
}
