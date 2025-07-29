'use client';

import { useCreateBookmarkedCafe, useDeleteBookmarkedCafe } from '@/hooks/supabase/bookmark';
import { useMapStore, useUserStore } from '@/stores';
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
  const isBookmarked = useMapStore(state => state.isBookmarked);
  const setIsBookmarked = useMapStore(state => state.setIsBookmarked);

  const { uploadBookmarkedCafe } = useCreateBookmarkedCafe();
  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();

  const handleBookmarkToggle = async () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmarkedCafe(bookmarkData.id);
        setIsBookmarked(false);
        toast.success('북마크에서 제거되었습니다.');
      } else {
        await uploadBookmarkedCafe({
          id: bookmarkData.id,
          user_id: userId,
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
        toast.success('북마크에 추가되었습니다.');
      }
    } catch {
      toast.error('작업 중 오류가 발생했습니다.');
    }
  };

  return (
    <button onClick={handleBookmarkToggle} className={`cursor-pointer ${className}`}>
      <Bookmark
        className={`size-8 ${isBookmarked ? 'text-bookmark fill-bookmark' : 'text-unbookmark'}`}
      />
    </button>
  );
}