'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores';
import { deleteBookmarkCafe } from '@/actions/supabase/bookmark';
import { bookmarkCafeQuery } from '@/queries/supabase/bookmark';
import { CONSOLE_ERROR, TOAST_ERROR } from '@/utils/constants/messages';

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
        onError: error => {
            console.error(CONSOLE_ERROR.DELETE_BOOKMARK_CAFE, error);
            toast.error(TOAST_ERROR.DELETE_BOOKMARK);
        },
    });

    return { deleteBookmarkCafe: deleteBookmark.mutateAsync };
}