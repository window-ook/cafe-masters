import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import {
  CollectedRowUpdate,
  updateCollectedCafe,
} from 'actions/collectActions';

export function useUpdateCollectMutation() {
  const userId = useUserStore(state => state.userId);

  const queryClient = useQueryClient();

  const collectedCafeDetail = useMapStore(
    state => state.collectedCafeDetail[0],
  );

  return useMutation({
    mutationFn: async (memo: CollectedRowUpdate) =>
      await updateCollectedCafe(memo, collectedCafeDetail.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe'] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe'] });
    },
    onError: error => console.error(error),
  });
}
