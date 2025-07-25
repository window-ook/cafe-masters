'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadBookmarkedCafe } from '@/hooks/supabase/useUploadBookmarkedCafe';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import { useUIStore, useUserStore } from 'stores';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import { IoBookmark } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from './CollectedBadge';
import Categories from './Categories';
import OpenTime from './OpenTime';
import Location from './Location';
import PhoneNumber from './PhoneNumber';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';

interface IRecommendedCafeDetailProps {
  cafeId: string;
  handleMenuOpenAction: () => void;
  setMemoOpenAction: (open: boolean) => void;
  setMemoRecommendationOpenAction: (open: boolean) => void;
}

export default function RecommendedCafeDetail({
  cafeId,
  setMemoOpenAction,
  setMemoRecommendationOpenAction,
}: IRecommendedCafeDetailProps) {
  const { admin, userId } = useUserStore();
  const {
    isDarkTheme,
    isCollected,
    isBookmarked,
    setIsSubSidebarOpen,
    setIsBookmarked,
  } = useUIStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const uploadBookmarkMutation = useUploadBookmarkedCafe();
  const deleteBookmarkMutation = useDeleteBookmarkedCafe();
  
  // React Query 캐시에서 추천 카페 데이터 가져오기
  const recommendedCafes = useRecommendedCafes();
  const detail = recommendedCafes?.find((cafe: ISupabaseRecommendedCafe) => cafe.id === cafeId);

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleBookmarkToggle = async () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmarkMutation.mutateAsync({
          userId,
          cafeId: detail.id,
        });
        setIsBookmarked(false);
        toast.success('북마크가 해제되었습니다.');
      } else {
        await uploadBookmarkMutation.mutateAsync({
          userId,
          cafeId: detail.id,
          name: detail.name,
          address: detail.address,
          phoneNumber: detail.phone_number,
          image: detail.image,
          coordX: detail.coordX,
          coordY: detail.coordY,
        });
        setIsBookmarked(true);
        toast.success('북마크에 추가되었습니다.');
      }
    } catch (error) {
      toast.error('작업 중 오류가 발생했습니다.');
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
          <button onClick={handleBookmarkToggle}>
            <IoBookmark 
              size={24} 
              className={isBookmarked ? 'text-main' : 'text-gray-400'} 
            />
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
            
            <Categories categories={detail.categories || []} />
            
            <Location address={detail.address} />
            
            <PhoneNumber phoneNumber={detail.phone_number} />
            
            <OpenTime openTime={detail.open_time || ''} />

            {/* 추천 배지 */}
            <div className="bg-recommended text-white px-3 py-1 rounded-full text-sm w-fit">
              추천 카페
            </div>

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
                수정하기
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}