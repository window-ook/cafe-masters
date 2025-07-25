'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadBookmarkedCafe } from '@/hooks/supabase/useUploadBookmarkedCafe';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useCafeStateStore, useUIStore, useUserStore } from 'stores';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import { IoBookmark } from 'react-icons/io5';
import { IoRefreshCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from './CollectedBadge';
import OpenTime from './OpenTime';
import Location from './Location';
import PhoneNumber from './PhoneNumber';

interface ICafeDetailProps {
  cafeId: string;
  handleMenuOpenAction: () => void;
  setMemoOpenAction: (open: boolean) => void;
  setMemoRecommendationOpenAction: (open: boolean) => void;
  onRefetch?: () => void;
}

export default function CafeDetail({
  cafeId,
  setMemoOpenAction,
  setMemoRecommendationOpenAction,
  onRefetch,
}: ICafeDetailProps) {
  const { admin, userId } = useUserStore();
  const {
    isDarkTheme,
    setIsSubSidebarOpen,
  } = useUIStore();

  const { isCollected, isBookmarked, setIsBookmarked } = useCafeStateStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const uploadBookmarkMutation = useUploadBookmarkedCafe();
  const deleteBookmarkMutation = useDeleteBookmarkedCafe();

  // TODO: 크롤링 데이터를 가져오는 로직 구현
  const detail = {
    id: cafeId,
    name: '로딩 중...',
    image: '',
    address: '',
    phone_number: '',
    categories: [],
    open_time: '',
    // 크롤링 데이터 필드들
  };

  const handleBookmarkToggle = async () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmarkMutation.mutateAsync(Number(detail.id));
        setIsBookmarked(false);
        toast.success('북마크가 해제되었습니다.');
      } else {
        await uploadBookmarkMutation.mutateAsync({
          user_id: userId,
          id: Number(detail.id),
          name: detail.name,
          address: detail.address,
          phone_number: detail.phone_number,
          image: detail.image,
          coordX: 0, // 크롤링에서 좌표 정보 추출
          coordY: 0,
        });
        setIsBookmarked(true);
        toast.success('북마크에 추가되었습니다.');
      }
    } catch {
      toast.error('작업 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setIsSubSidebarOpen(false);
    router.back();
  };

  const handleRefresh = () => {
    if (onRefetch) onRefetch();
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
          <div className="flex gap-2">
            <button onClick={handleRefresh}>
              <IoRefreshCircle size={24} />
            </button>
            <button onClick={handleBookmarkToggle}>
              <IoBookmark
                size={24}
                className={isBookmarked ? 'text-main' : 'text-gray-400'}
              />
            </button>
          </div>
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

            <OpenTime opening_time={detail.open_time || ''} />

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