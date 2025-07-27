import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import {
  CollectedRowInsert,
  createCollectedCafe,
} from '@/actions/supabase/collection';

/** 수집한 카페 추가 훅 */
export function useUploadCollectedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();

  const uploadCollected = useMutation({
    mutationFn: async (memo: CollectedRowInsert) => await createCollectedCafe(memo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] }),
    onError: error => console.error(error),
  });

  return { uploadCollectedCafe: uploadCollected.mutate };
}