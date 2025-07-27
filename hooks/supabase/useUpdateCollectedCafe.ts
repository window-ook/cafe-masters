import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useMapStore, useUserStore } from '@/stores';
import { CollectedRowUpdate, updateCollectedCafe } from '@/actions/supabase/collection';

/** 수집한 카페 수정 훅 */
export function useUpdateCollectedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();
  const { currentCafeId } = useMapStore();

  const updateCollected = useMutation({
    mutationFn: async (memo: CollectedRowUpdate) => await updateCollectedCafe(memo, currentCafeId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] }),
    onError: error => console.error(error),
  });

  return { updateCollectedCafe: updateCollected.mutate };
}