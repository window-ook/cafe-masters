import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import {
  BookmarkedRowInsert,
  createBookmarkedCafe,
} from 'actions/bookmarkActions';

export function useUploadBookmarkMutation() {
  const userId = useUserStore(state => state.userId);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (detail: BookmarkedRowInsert) =>
      await createBookmarkedCafe(detail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
    },
    onError: error => console.error(error),
  });
}
