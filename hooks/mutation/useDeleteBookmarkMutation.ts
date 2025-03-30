import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import { deleteBookmarkedCafe } from 'actions/bookmarkActions';

export function useDeleteBookmarkMutation() {
  const userId = useUserStore(state => state.userId);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cafeId: number) => {
      return await deleteBookmarkedCafe(cafeId, userId);
    },
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
