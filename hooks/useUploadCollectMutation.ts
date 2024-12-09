import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import { UserStore } from 'types/store';
import {
  CollectedRowInsert,
  createCollectedCafe,
} from 'actions/collectActions';
import { toast } from 'react-toastify';

export function useUploadCollectMutation() {
  const userId = useUserStore((state: UserStore) => state.userId);

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation({
    mutationFn: async (memo: CollectedRowInsert) =>
      await createCollectedCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
      toast.success(`새로운 카드를 수집했습니다!`);
      router.refresh();
    },
    onError: error => console.error(error),
  });
}
