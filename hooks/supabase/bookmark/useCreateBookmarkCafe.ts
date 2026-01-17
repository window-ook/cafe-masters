'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BookmarkRowInsert, createBookmarkCafe } from '@/actions/supabase/bookmark';
import { useUserStore } from '@/stores';
import { bookmarkCafeQuery } from '@/queries/supabase/bookmark';
import { CONSOLE_ERROR, TOAST_ERROR } from '@/utils/constants/messages';

/** 북마크한 카페 추가 훅 */
export function useCreateBookmarkCafe() {
    const queryClient = useQueryClient();

    const { userId } = useUserStore();

    const uploadBookmark = useMutation({
        mutationFn: async (detail: Omit<BookmarkRowInsert, 'user_id'>) => await createBookmarkCafe(detail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookmarkCafeQuery.all(userId) });
            queryClient.invalidateQueries({ queryKey: bookmarkCafeQuery.counts(userId) });
        },
        onError: error => {
            console.error(CONSOLE_ERROR.CREATE_BOOKMARK_CAFE, error);
            toast.error(TOAST_ERROR.CREATE_BOOKMARK);
        },
    });

    return { createBookmarkCafe: uploadBookmark.mutateAsync };
}
