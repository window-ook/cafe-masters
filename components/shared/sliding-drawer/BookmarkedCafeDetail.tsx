'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useCurrentCafeStore, useUIStore, useUserStore } from 'stores';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import { IoBookmark } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';

interface IBookmarkedCafeDetail {
  cafeId: number;
  setIsCollectedFormOpenAction: (open: boolean) => void;
  setIsRecommendFormOpenAction: (open: boolean) => void;
}

export default function BookmarkedCafeDetail({ cafeId, setIsCollectedFormOpenAction, setIsRecommendFormOpenAction }: IBookmarkedCafeDetail) {
  const router = useRouter();

  const { admin, userId } = useUserStore();
  const { isDarkTheme, setIsSlidingDrawerOpen } = useUIStore();
  const { isCollected, setIsBookmarked } = useCurrentCafeStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { filteredBookmarkedCafes } = useBookmarkedCafes(userId);

  const detail = filteredBookmarkedCafes.find((cafe: ISupabaseBookmarkedCafe) => cafe.id === Number(cafeId));

  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleBookmarkRemove = async () => {
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
    <div
      className={`h-full flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-white'}`}
      ref={scrollRef}
    >
      {/* 헤더 */}
      <header className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex justify-between items-center p-4">
          <button onClick={handleClose}>
            <IoCloseCircle size={24} />
          </button>
          <button onClick={handleBookmarkRemove}>
            <IoBookmark size={24} className="text-main" />
          </button>
        </div>
      </header>

      {/* 바디 */}
      <main className={`flex-1 overflow-y-auto ${getDetailBodyStyle(isDarkTheme)}`}>
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
            <button
              onClick={() => setIsCollectedFormOpenAction(true)}
              className="flex-1 bg-main text-white py-2 px-4 rounded-lg"
            >
              수집하기
            </button>
            {admin && (
              <button
                onClick={() => setIsRecommendFormOpenAction(true)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                추천하기
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}