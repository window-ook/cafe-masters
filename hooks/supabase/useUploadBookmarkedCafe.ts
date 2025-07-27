import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import { BookmarkedRowInsert, createBookmarkedCafe } from '@/actions/supabase/bookmark';

/** 북마크한 카페 추가 훅 */
export function useUploadBookmarkedCafe() {
  const queryClient = useQueryClient();

  const { userId } = useUserStore();

  const uploadBookmark = useMutation({
    mutationFn: async (detail: BookmarkedRowInsert) => await createBookmarkedCafe(detail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafeCount', userId] });
    },
    onError: error => console.error(error),
  });

  return { uploadBookmarkedCafe: uploadBookmark.mutate };
}