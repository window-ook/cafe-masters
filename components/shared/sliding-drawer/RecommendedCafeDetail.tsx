'use client';

import { useRouter } from 'next/navigation';
import { useMapStore, useUIStore, useUserStore } from 'stores';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import { useCollectedCafeFormForUpload } from '@/hooks/supabase/useCollectedCafes';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { CircleX } from 'lucide-react';
import Image from 'next/image';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import Categories from './Categories';
import OpenTime from '@/components/shared/sliding-drawer/OpenTime';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Button from '@/components/shared/sliding-drawer/Button';
import BookmarkToggleButton from './BookmarkToggleButton';
import Menus from './Menus';

interface IRecommendedCafeDetail {
  cafeId: number;
  setIsRecommendFormOpenAction: (open: boolean) => void;
}

export default function RecommendedCafeDetail({
  cafeId,
  setIsRecommendFormOpenAction,
}: IRecommendedCafeDetail) {
  const router = useRouter();

  const admin = useUserStore(state => state.admin);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const isCollected = useMapStore(state => state.isCollected);

  const { recommendedCafes } = useRecommendedCafes();
  const { handleCollectClick } = useCollectedCafeFormForUpload();

  const recommendedCafedetail = recommendedCafes?.find((cafe: ISupabaseRecommendedCafe) => cafe.id === cafeId);

  if (!recommendedCafedetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <div className={`h-full rounded-md flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : ''}`}>
      {/* 헤더 */}
      <header className={`p-2 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className="flex justify-between items-center p-4 w-full">
          <div className='flex items-center gap-2'>
            <BookmarkToggleButton
              bookmarkData={{
                id: recommendedCafedetail.id,
                name: recommendedCafedetail.name,
                address: recommendedCafedetail.address,
                phone_number: recommendedCafedetail.phone_number || '',
                image: recommendedCafedetail.image || '',
                coordX: recommendedCafedetail.coordX,
                coordY: recommendedCafedetail.coordY,
                extra_images: recommendedCafedetail.extra_images || null,
                opening_time: recommendedCafedetail.opening_time || null,
                menus: recommendedCafedetail.menus ? (() => {
                  try {
                    return JSON.parse(recommendedCafedetail.menus);
                  } catch {
                    return null;
                  }
                })() : null,
              }}
            />
            {/* 수집 상태 배지 */}
            {isCollected && <CollectedBadge />}
          </div>
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
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleCollectClick({
                name: recommendedCafedetail.name,
                coordX: recommendedCafedetail.coordX,
                coordY: recommendedCafedetail.coordY,
                address: recommendedCafedetail.address,
                image: recommendedCafedetail.image,
                extra_images: recommendedCafedetail.extra_images || [],
                phone_number: recommendedCafedetail.phone_number,
                opening_time: recommendedCafedetail.opening_time,
              })}
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
          <Menus menus={recommendedCafedetail.menus ? (() => {
            try {
              return JSON.parse(recommendedCafedetail.menus);
            } catch {
              return null;
            }
          })() : null} />
        </div>
      </main>
    </div>
  );
}