'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useCafeStateStore, useUIStore, useUserStore } from 'stores';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import { IoBookmark } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from './CollectedBadge';
import Location from './Location';
import PhoneNumber from './PhoneNumber';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';

interface IBookmarkedCafeDetailProps {
  cafeId: string;
  handleMenuOpenAction: () => void;
  setMemoOpenAction: (open: boolean) => void;
  setMemoRecommendationOpenAction: (open: boolean) => void;
}

export default function BookmarkedCafeDetail({
  cafeId,
  setMemoOpenAction,
  setMemoRecommendationOpenAction,
}: IBookmarkedCafeDetailProps) {
  const { admin, userId } = useUserStore();
  const {
    isDarkTheme,
    setIsSubSidebarOpen,

  } = useUIStore();

  const { isCollected, setIsBookmarked } = useCafeStateStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const deleteBookmarkMutation = useDeleteBookmarkedCafe();

  // React Query 캐시에서 북마크된 카페 데이터 가져오기
  const { filteredData: bookmarkedCafes } = useBookmarkedCafes(userId, true);
  const detail = bookmarkedCafes.find((cafe: ISupabaseBookmarkedCafe) => cafe.id === Number(cafeId));

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
      await deleteBookmarkMutation.mutateAsync(detail.id);
      setIsBookmarked(false);
      toast.success('북마크가 해제되었습니다.');
      handleClose();
    } catch {
      toast.error('북마크 해제 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setIsSubSidebarOpen(false);
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
              onClick={() => setMemoOpenAction(true)}
              className="flex-1 bg-main text-white py-2 px-4 rounded-lg"
            >
              수집하기
            </button>
            {admin && (
              <button
                onClick={() => setMemoRecommendationOpenAction(true)}
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