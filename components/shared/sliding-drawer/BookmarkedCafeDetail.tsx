'use client';

import { useRouter } from 'next/navigation';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useMapStore, useUIStore, useUserStore } from 'stores';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { Bookmark, CircleX } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Button from '@/components/shared/sliding-drawer/Button';

interface IBookmarkedCafeDetail {
  cafeId: number;
  setIsCollectedFormOpenAction: (open: boolean) => void;
  setIsRecommendFormOpenAction: (open: boolean) => void;
}

export default function BookmarkedCafeDetail({ cafeId, setIsCollectedFormOpenAction, setIsRecommendFormOpenAction }: IBookmarkedCafeDetail) {
  const router = useRouter();

  const admin = useUserStore(state => state.admin);
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const isCollected = useMapStore(state => state.isCollected);
  const setIsBookmarked = useMapStore(state => state.setIsBookmarked);


  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();
  const { filteredBookmarkedCafes } = useBookmarkedCafes(userId);

  const detail = filteredBookmarkedCafes.find((cafe: ISupabaseBookmarkedCafe) => cafe.id === Number(cafeId));

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleBookmarkDelete = async () => {
    if (!userId) return;

    try {
      await deleteBookmarkedCafe(detail.id);
      setIsBookmarked(false);
      toast.success('북마크가 해제되었습니다.');
      handleClose();
    } catch {
      toast.error('북마크 해제 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <div className={`h-full rounded-md flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : ''}`}>
      {/* 헤더 */}
      <header className={`p-2 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className="flex justify-between items-center p-4 w-full">
          <button onClick={handleBookmarkDelete} className='cursor-pointer'>
            <Bookmark className="size-8 text-bookmark fill-bookmark" />
          </button>
          <button onClick={handleClose} className='cursor-pointer'>
            <CircleX className='size-8' />
          </button>
        </div>
      </header>

      {/* 바디 */}
      <main className={`p-2 overflow-y-auto flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <div className="p-4 space-y-6">
          {/* 카페 이미지 */}
          {detail.image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={detail.image}
                alt={detail.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* 카페 정보 */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{detail.name}</h1>

            <Location address={detail.address} />

            <PhoneNumber phone_number={detail.phone_number!} />

            {/* 수집 상태 배지 */}
            {isCollected && <CollectedBadge />}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCollectedFormOpenAction(true)}
              customClassName='flex-1'
            >
              수집하기
            </Button>
            {admin && (
              <Button
                onClick={() => setIsRecommendFormOpenAction(true)}
                customClassName='flex-1 bg-blue-600'
              >
                추천하기
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}