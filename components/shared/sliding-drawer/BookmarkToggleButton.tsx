'use client';

import { useCreateBookmarkCafe, useDeleteBookmarkCafe } from '@/hooks/supabase/bookmark';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { TOAST_ERROR, TOAST_SUCCESS } from '@/utils/constants/messages';
import { Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

interface IBookmarkData {
  id: number;
  name: string;
  address: string;
  phone_number: string | null;
  image: string | null;
  coordX: number;
  coordY: number;
  extra_images?: string[] | null;
  opening_time?: string | null;
  menus?: { name: string; price: string; }[] | null;
}

interface IBookmarkToggleButton {
  bookmarkData: IBookmarkData;
  className?: string;
}

export default function BookmarkToggleButton({ bookmarkData, className = '' }: IBookmarkToggleButton) {
  const userId = useUserStore(state => state.userId);
  const isBookmarked = useCurrentCafeStore(state => state.isBookmarked);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);

  const { createBookmarkCafe } = useCreateBookmarkCafe();
  const { deleteBookmarkCafe } = useDeleteBookmarkCafe();

  const handleBookmarkToggle = async () => {
    if (!userId) {
      toast.error(TOAST_ERROR.BOOMARK_TOGGLE_WITHOUT_SIGNIN);
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmarkCafe(bookmarkData.id);
        setIsBookmarked(false);
        toast.success(TOAST_SUCCESS.DELETE_BOOKMARK);
      } else {
        await createBookmarkCafe({
          id: bookmarkData.id,
          coordX: bookmarkData.coordX,
          coordY: bookmarkData.coordY,
          image: bookmarkData.image || '',
          extra_images: bookmarkData.extra_images ? JSON.stringify(bookmarkData.extra_images) : null,
          name: bookmarkData.name,
          address: bookmarkData.address,
          phone_number: bookmarkData.phone_number || '',
          opening_time: bookmarkData.opening_time || null,
          menus: bookmarkData.menus ? JSON.stringify(bookmarkData.menus) : null,
        });
        setIsBookmarked(true);
        toast.success(TOAST_SUCCESS.CREATE_BOOKMARK);
      }
    } catch {
      toast.error(TOAST_ERROR.BOOMARK_TOGGLE);
    }
  };

  return (
    <button
      type="button"
      data-testid="bookmark-button"
      aria-label="북마크 토글 버튼"
      onClick={handleBookmarkToggle}
      className={`cursor-pointer ${className}`}
    >
      <Bookmark
        className={`size-8 ${isBookmarked ? 'text-bookmark fill-bookmark' : 'text-unbookmark'}`}
      />
    </button>
  );
}