import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import { deleteBookmarkedCafe } from '@/actions/supabase/bookmark';
import { bookmarkedCafeQuery } from '@/queries/supabase/bookmark';

/** 북마크한 카페 삭제 훅 */
export function useDeleteBookmarkedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();

  const deleteBookmark = useMutation({
    mutationFn: async (cafeId: number) => await deleteBookmarkedCafe(cafeId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkedCafeQuery.all(userId) });
      queryClient.invalidateQueries({ queryKey: bookmarkedCafeQuery.counts(userId) });
    },
    onError: error => console.error(error),
  });

  return { deleteBookmarkedCafe: deleteBookmark.mutate };
}