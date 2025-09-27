'use client';

import { useRouter } from 'next/navigation';
import { useBookmarkCafes } from '@/hooks/supabase/bookmark/useBookmarkCafes';
import { useDeleteBookmarkCafe } from '@/hooks/supabase/bookmark';
import { useCollectionStore } from '@/stores/collection';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { ISupabaseBookmarkCafe } from '@/types/supabase/bookmark';
import { useCloseSlidingDrawer } from '@/hooks/ui/useCloseSlidingDrawer';
import { TOAST_SUCCESS } from '@/utils/constants/messages';
import { toast } from 'react-toastify';
import { Bookmark, CircleX } from 'lucide-react';
import Button from '@/components/shared/Button';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import RecommendedBadge from '@/components/shared/sliding-drawer/RecommendedBadge';

export default function BookmarkCafeDetail({ cafeId }: { cafeId: number }) {
  const router = useRouter();

  const userId = useUserStore(state => state.userId);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);
  const setTargetCafeForCollect = useCollectionStore(state => state.setTargetCafeForCollect);

  const { filteredBookmarkCafes } = useBookmarkCafes(userId);

  const { deleteBookmarkCafe } = useDeleteBookmarkCafe();

  const handleClose = useCloseSlidingDrawer();

  const detail = filteredBookmarkCafes.find((cafe: ISupabaseBookmarkCafe) => cafe.id === Number(cafeId));

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
    <>
      {/* 로그인 상태 */}
      {userId && <Button
        onClick={() => setTargetCafeForCollect({
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
      </Button>}

      {/* 로그아웃 상태 */}
      {!userId && <Button onClick={() => router.push('/signin')} customClassName='flex-1'>
        로그인하고 수집하기
      </Button>}
    </>
  );

  const handleBookmarkDeletion = async () => {
    await deleteBookmarkCafe(bookmarkData.id);
    setIsBookmarked(false);
    toast.success(TOAST_SUCCESS.DELETE_BOOKMARK);
  };

  return (
    <article className="h-full rounded-md flex flex-col">
      <header className="w-full p-4 flex justify-between items-center">
        <div className='flex items-center gap-2'>
          <button
            type='button'
            data-testid="bookmark-cancel-button"
            onClick={() => handleBookmarkDeletion()}
            className='cursor-pointer'
          >
            <Bookmark className='size-8 text-bookmark fill-bookmark' />
          </button>
          {isCollected && <CollectedBadge />}
          {isRecommended && <RecommendedBadge />}
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
    </article>
  );
}