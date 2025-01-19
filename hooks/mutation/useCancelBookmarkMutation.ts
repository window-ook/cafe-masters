import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { deleteBookmarkedCafe } from 'actions/bookmarkActions';

export function useCancelBookmarkMutation() {
  const bookmarkedCafeDetail = useMapStore(
    state => state.bookmarkedCafeDetail[0],
  );
  const userId = useUserStore(state => state.userId);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await deleteBookmarkedCafe(bookmarkedCafeDetail?.id, userId),
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
