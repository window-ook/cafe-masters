'use client';

import { useRouter } from 'next/navigation';
import { useBookmarkCafes } from '@/hooks/supabase/bookmark/useBookmarkCafes';
import { useDeleteBookmarkCafe } from '@/hooks/supabase/bookmark';
import { useCollectionStore } from '@/stores/collection';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { useCloseSlidingDrawer } from '@/hooks/ui/useCloseSlidingDrawer';
import { ISupabaseBookmarkCafe } from '@/types/supabase/bookmark';
import { TOAST_ERROR, TOAST_SUCCESS } from '@/utils/constants/messages';
import { toast } from 'react-toastify';
import { Bookmark, CircleX } from 'lucide-react';
import Button from '@/components/shared/Button';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import RecommendedBadge from '@/components/shared/sliding-drawer/RecommendedBadge';

export default function BookmarkCafeDetail({ cafeId }: { cafeId: number }) {
  const router = useRouter();

  const session = useUserStore(state => state.session);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);
  const setTargetCafeForCollect = useCollectionStore(
    state => state.setTargetCafeForCollect,
  );

  const { filteredBookmarkCafes } = useBookmarkCafes(session?.user?.id ?? '');

  const { deleteBookmarkCafe } = useDeleteBookmarkCafe();

  const handleClose = useCloseSlidingDrawer();

  const detail = filteredBookmarkCafes.find(
    (cafe: ISupabaseBookmarkCafe) => cafe.id === Number(cafeId),
  );

  if (!detail) {
    return (
      <div className="flex h-full items-center justify-center">
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
    opening_time: detail.opening_time || '미등록',
    menus: detail.menus
      ? (() => {
          try {
            return JSON.parse(detail.menus);
          } catch {
            return null;
          }
        })()
      : null,
  };

  const actionButtons = (
    <>
      {/* 로그인 상태 */}
      {session && (
        <Button
          onClick={() =>
            setTargetCafeForCollect({
              id: detail.id,
              name: detail.name,
              coordX: detail.coordX,
              coordY: detail.coordY,
              address: detail.address,
              image: detail.image,
              extra_images: detail.extra_images || [],
              phone_number: detail.phone_number,
              opening_time: detail.opening_time,
            })
          }
          customClassName="flex-1"
        >
          수집하기
        </Button>
      )}

      {/* 로그아웃 상태 */}
      {!session && (
        <Button onClick={() => router.push('/signin')} customClassName="flex-1">
          로그인하고 수집하기
        </Button>
      )}
    </>
  );

  const handleBookmarkDeletion = async () => {
    try {
      await deleteBookmarkCafe(bookmarkData.id);
      toast.success(TOAST_SUCCESS.DELETE_BOOKMARK);
      setIsBookmarked(false);
    } catch (error) {
      toast.error(TOAST_ERROR.DELETE_BOOKMARK);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-md">
      <header className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="bookmark-cancel-button"
            onClick={() => handleBookmarkDeletion()}
            className="cursor-pointer"
          >
            <Bookmark className="text-bookmark fill-bookmark size-8" />
          </button>
          {isCollected && <CollectedBadge />}
          {isRecommended && <RecommendedBadge />}
        </div>
        <button
          aria-label="카페 상세 정보 보기 취소 버튼"
          onClick={handleClose}
          className="cursor-pointer"
        >
          <CircleX className="size-8" />
        </button>
      </header>
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={cafeData}
        actionButtons={actionButtons}
        isImageWithFallback={true}
      />
    </article>
  );
}
