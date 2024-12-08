import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { MapStore, UserStore } from 'types/store';
import {
  CollectedRowUpdate,
  updateCollectedCafe,
} from 'actions/collectedActions';
import { toast } from 'react-toastify';

export function useUpdateCollectMutation() {
  const userId = useUserStore((state: UserStore) => state.userId);

  const queryClient = useQueryClient();

  const router = useRouter();

  const collectedCafeDetail = useMapStore(
    (state: MapStore) => state.collectedCafeDetail[0],
  );

  return useMutation({
    mutationFn: async (memo: CollectedRowUpdate) =>
      await updateCollectedCafe(memo, collectedCafeDetail.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
      toast.success('카드의 스펙을 수정했습니다!');
      router.refresh();
    },
    onError: error => console.error(error),
  });
}
