'use client';

import { useRouter } from 'next/navigation';
import { useBookmarkedCafes } from '@/hooks/supabase/bookmark/useBookmarkedCafes';
import { useCreateCollectedCafe } from '@/hooks/supabase/collection';
import { useCurrentCafeStore, useUIStore, useUserStore } from 'stores';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { Bookmark, CircleX } from 'lucide-react';
import Button from '@/components/shared/sliding-drawer/Button';
import CafeDetailBody from './CafeDetailBody';
import CollectedBadge from './CollectedBadge';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/bookmark';
import { toast } from 'react-toastify';

export default function BookmarkedCafeDetail({ cafeId }: { cafeId: number }) {
  const router = useRouter();

  const userId = useUserStore(state => state.userId);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  const { filteredBookmarkedCafes } = useBookmarkedCafes(userId);
  const { selectTargetCafeForCollect } = useCreateCollectedCafe();
  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();


  const detail = filteredBookmarkedCafes.find((cafe: ISupabaseBookmarkedCafe) => cafe.id === Number(cafeId));

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const bookmarkData = {
    id: detail.id,
    name: detail.name,
    address: detail.address,
    phone_number: detail.phone_number || '',
    image: detail.image || '',
    coordX: detail.coordX,
    coordY: detail.coordY,
    extra_images: detail.extra_images || null,
    opening_time: detail.opening_time || null,
    menus: detail.menus ? JSON.parse(detail.menus) : null,
  };

  const cafeData = {
    name: detail.name,
    address: detail.address,
    phone_number: detail.phone_number || '',
    image: detail.image || '',
    extra_images: detail.extra_images || [],
    opening_time: detail.opening_time || '등록 X',
    menus: detail.menus ? (() => {
      try {
        return JSON.parse(detail.menus);
      } catch {
        return null;
      }
    })() : null,
  };

  const actionButtons = (
    <Button
      onClick={() => selectTargetCafeForCollect({
        id: detail.id,
        name: detail.name,
        coordX: detail.coordX,
        coordY: detail.coordY,
        address: detail.address,
        image: detail.image,
        extra_images: detail.extra_images || [],
        phone_number: detail.phone_number,
        opening_time: detail.opening_time,
      })}
      customClassName='flex-1'
    >
      수집하기
    </Button>
  );

  const handleBookmarkDeletion = async () => {
    await deleteBookmarkedCafe(bookmarkData.id);
    setIsBookmarked(false);
    toast.success('북마크에서 제거되었습니다.');
  };

  return (
    <div className="h-full rounded-md flex flex-col">
      <header className="w-full p-4 flex justify-between items-center">
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => handleBookmarkDeletion()}
            className='cursor-pointer'
          >
            <Bookmark className='size-8 text-bookmark fill-bookmark' />
          </button>
          {isCollected && <CollectedBadge />}
        </div>
        <button onClick={handleClose} className='cursor-pointer'>
          <CircleX className='size-8' />
        </button>
      </header>
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={cafeData}
        actionButtons={actionButtons}
        useImageWithFallback={true}
      />
    </div>
  );
}