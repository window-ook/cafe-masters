import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useMapStore, useUserStore } from '@/stores';
import { CollectedRowUpdate, updateCollectedCafe } from '@/actions/supabase/collection';
import { collectedCafeQuery } from '@/queries/supabase/collection';

/** 수집한 카페 수정 훅 */
export function useUpdateCollectedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();
  const { currentCafeId } = useMapStore();

  const updateCollected = useMutation({
    mutationFn: async (formData: CollectedRowUpdate) => await updateCollectedCafe(formData, currentCafeId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collectedCafeQuery.all(userId) }),
    onError: error => console.error(error),
  });

  return { updateCollectedCafe: updateCollected.mutate };
}