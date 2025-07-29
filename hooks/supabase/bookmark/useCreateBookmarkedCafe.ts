import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkedRowInsert, createBookmarkedCafe } from '@/actions/supabase/bookmark';
import { useUserStore } from '@/stores';
import { bookmarkedCafeQuery } from '@/queries/supabase/bookmark';


/** 북마크한 카페 추가 훅 */
export function useCreateBookmarkedCafe() {
    const queryClient = useQueryClient();

    const { userId } = useUserStore();

    const uploadBookmark = useMutation({
        mutationFn: async (detail: BookmarkedRowInsert) => await createBookmarkedCafe(detail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookmarkedCafeQuery.all(userId) });
            queryClient.invalidateQueries({ queryKey: bookmarkedCafeQuery.counts(userId) });
        },
        onError: error => console.error(error),
    });

    return { uploadBookmarkedCafe: uploadBookmark.mutate };
}
