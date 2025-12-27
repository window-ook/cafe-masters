import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/stores';
import { deleteBookmarkCafe } from '@/actions/supabase/bookmark';
import { bookmarkCafeQuery } from '@/queries/supabase/bookmark';

/** 북마크한 카페 삭제 훅 */
export function useDeleteBookmarkCafe() {
    const queryClient = useQueryClient();

    const { userId } = useUserStore();

    const deleteBookmark = useMutation({
        mutationFn: async (cafeId: number) => await deleteBookmarkCafe(cafeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookmarkCafeQuery.all(userId) });
            queryClient.invalidateQueries({ queryKey: bookmarkCafeQuery.counts(userId) });
        },
        onError: error => console.error(error),
    });

    return { deleteBookmarkCafe: deleteBookmark.mutateAsync };
}