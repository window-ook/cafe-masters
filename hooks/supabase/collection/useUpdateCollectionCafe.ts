import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { CollectionRowUpdate, updateCollectionCafe } from '@/actions/supabase/collection';
import { collectionCafeQuery } from '@/queries/supabase/collection';

/** 수집한 카페 수정 훅 */
export function useUpdateCollectionCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();
  const { currentCafeId } = useCurrentCafeStore();

  const updateCollection = useMutation({
    mutationFn: async (formData: CollectionRowUpdate) => await updateCollectionCafe(formData, currentCafeId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: collectionCafeQuery.all(userId) }),
    onError: error => console.error(error),
  });

  return { updateCollectionCafe: updateCollection.mutate };
}