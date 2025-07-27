'use client';

import { useRouter } from 'next/navigation';
import { useUploadBookmarkedCafe } from '@/hooks/supabase/useUploadBookmarkedCafe';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useMapStore, useUIStore, useUserStore } from 'stores';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { Bookmark, CircleX } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import Categories from './Categories';
import OpenTime from '@/components/shared/sliding-drawer/OpenTime';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Button from '@/components/shared/sliding-drawer/Button';

interface IRecommendedCafeDetail {
  cafeId: number;
  setIsCollectedFormOpenAction: (open: boolean) => void;
  setIsRecommendFormOpenAction: (open: boolean) => void;
}

export default function RecommendedCafeDetail({
  cafeId,
  setIsCollectedFormOpenAction,
  setIsRecommendFormOpenAction,
}: IRecommendedCafeDetail) {
  const router = useRouter();

  const admin = useUserStore(state => state.admin);
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const isCollected = useMapStore(state => state.isCollected);
  const isBookmarked = useMapStore(state => state.isBookmarked);
  const setIsBookmarked = useMapStore(state => state.setIsBookmarked);


  const { uploadBookmarkedCafe } = useUploadBookmarkedCafe();
  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();

  const { recommendedCafes } = useRecommendedCafes();

  const recommendedCafedetail = recommendedCafes?.find((cafe: ISupabaseRecommendedCafe) => cafe.id === cafeId);

  if (!recommendedCafedetail) {
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
        await deleteBookmarkedCafe(recommendedCafedetail.id);
        setIsBookmarked(false);
        toast.success('북마크가 해제되었습니다.');
      } else {
        await uploadBookmarkedCafe({
          user_id: userId,
          id: recommendedCafedetail.id,
          name: recommendedCafedetail.name,
          address: recommendedCafedetail.address,
          phone_number: recommendedCafedetail.phone_number,
          image: recommendedCafedetail.image,
          coordX: recommendedCafedetail.coordX,
          coordY: recommendedCafedetail.coordY,
        });
        setIsBookmarked(true);
        toast.success('북마크에 추가되었습니다.');
      }
    } catch {
      toast.error('작업 중 오류가 발생했습니다.');
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
          <button onClick={handleBookmarkToggle} className='cursor-pointer'>
            <Bookmark className={`size-8 ${isBookmarked ? 'text-bookmark fill-bookmark' : 'text-unbookmark'}`} />
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
          {recommendedCafedetail.image && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={recommendedCafedetail.image}
                alt={recommendedCafedetail.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* 카페 정보 */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{recommendedCafedetail.name}</h1>

            <Categories categories={recommendedCafedetail.categories.split(',')} />
            <Location address={recommendedCafedetail.address} />
            <PhoneNumber phone_number={recommendedCafedetail.phone_number!} />
            <OpenTime opening_time={recommendedCafedetail.opening_time || ''} />

            {/* 추천 배지 */}
            <div className="bg-recommended text-white px-3 py-1 rounded-full text-sm w-fit">
              추천 카페
            </div>

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
                수정하기
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}