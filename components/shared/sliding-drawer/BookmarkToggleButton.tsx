'use client';

import {
  useCreateBookmarkCafe,
  useDeleteBookmarkCafe,
} from '@/hooks/supabase/bookmark';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { TOAST_ERROR, TOAST_SUCCESS } from '@/utils/constants/messages';
import { Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

/** 북마크는 지도 마커와 목록에 필요한 이름·주소·좌표만 저장합니다 */
interface IBookmarkData {
  id: number;
  name: string;
  address: string;
  coordX: number;
  coordY: number;
}

interface IBookmarkToggleButton {
  bookmarkData: IBookmarkData;
  className?: string;
}

export default function BookmarkToggleButton({
  bookmarkData,
  className = '',
}: IBookmarkToggleButton) {
  const session = useUserStore(state => state.session);
  const isBookmarked = useCurrentCafeStore(state => state.isBookmarked);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);

  const { createBookmarkCafe } = useCreateBookmarkCafe();
  const { deleteBookmarkCafe } = useDeleteBookmarkCafe();

  const handleBookmarkToggle = async () => {
    if (!session) {
      toast.error(TOAST_ERROR.BOOMARK_TOGGLE_WITHOUT_SIGNIN);
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmarkCafe(bookmarkData.id);
        toast.success(TOAST_SUCCESS.DELETE_BOOKMARK);
        setIsBookmarked(false);
      } else {
        await createBookmarkCafe({
          id: bookmarkData.id,
          coordX: bookmarkData.coordX,
          coordY: bookmarkData.coordY,
          name: bookmarkData.name,
          address: bookmarkData.address,
        });
        toast.success(TOAST_SUCCESS.CREATE_BOOKMARK);
        setIsBookmarked(true);
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
