import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import {
  BookmarkedRowInsert,
  createBookmarkedCafe,
} from '@/actions/supabase/bookmark';

export function useUploadBookmarkedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();

  return useMutation({
    mutationFn: async (detail: BookmarkedRowInsert) =>
      await createBookmarkedCafe(detail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.invalidateQueries({
        queryKey: ['bookmarkedCafeCount', userId],
      });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafeCount', userId] });
    },
    onError: error => console.error(error),
  });
}
