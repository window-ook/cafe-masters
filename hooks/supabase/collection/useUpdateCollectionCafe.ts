'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { CollectionRowUpdate, updateCollectionCafe } from '@/actions/supabase/collection';
import { collectionCafeQuery } from '@/queries/supabase/collection';
import { CONSOLE_ERROR, TOAST_ERROR } from '@/utils/constants/messages';

/** 수집한 카페 수정 훅 */
export function useUpdateCollectionCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();
  const { currentCafeId } = useCurrentCafeStore();

  const updateCollection = useMutation({
    mutationFn: async (formData: CollectionRowUpdate) => await updateCollectionCafe(formData, currentCafeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionCafeQuery.all(userId) });
      queryClient.invalidateQueries({ queryKey: collectionCafeQuery.counts(userId) });
    },
    onError: error => {
      console.error(CONSOLE_ERROR.EDIT_COLLECTION_CAFE, error);
      toast.error(TOAST_ERROR.EDIT_COLLECTION);
    },
  });

  return { updateCollectionCafe: updateCollection.mutateAsync };
}