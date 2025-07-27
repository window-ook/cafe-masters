'use client';

import { useRouter } from 'next/navigation';
import { useUIStore, useUserStore } from 'stores';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { CircleX } from 'lucide-react';
import Image from 'next/image';
import Ratings from './Ratings';
import Location from './Location';
import PhoneNumber from './PhoneNumber';
import Comment from './Comment';
import EatenMenus from './EatenMenus';
import Pros from './Pros';
import Cons from './Cons';
import OpenTime from './OpenTime';
import Categories from './Categories';
import Button from '@/components/shared/sliding-drawer/Button';

export default function CollectedCafeDetail({ cafeId, setIsCollectedFormOpenAction }: { cafeId: number; setIsCollectedFormOpenAction: (open: boolean) => void }) {
  const router = useRouter();

  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

  const { filteredCollectedCafes } = useCollectedCafes(userId);

  const collectedCafeDetail = filteredCollectedCafes.find((cafe: ISupabaseCollectedCafe) => cafe.id === cafeId);

  if (!collectedCafeDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleSetIsSubSidebarOpen = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <div className={`h-full rounded-md flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : ''}`}>
      {/* 헤더 */}
      <header className={`w-full p-4 flex justify-between items-center ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <div />
        <button
          onClick={handleSetIsSubSidebarOpen}
          className='cursor-pointer'
          type="button"
          aria-label="수집한 카드 상세 정보 보기 취소 버튼"
        >
          <CircleX className='size-8' />
        </button>
      </header>

      {/* 바디 */}
      <main className={`overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <section className="flex flex-col items-center">
          <a
            href={`http://place.map.kakao.com/${collectedCafeDetail?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transform duration-300 ease-out hover:opacity-30"
          >
            <Image
              src={
                collectedCafeDetail?.image ?? '/image/cafe_thumbnail.avif'
              }
              alt="카페 썸네일"
              className="rounded-md w-auto h-auto"
              width={160}
              height={30}
              priority={true}
            />
          </a>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{collectedCafeDetail?.name}</h1>
            <Ratings rating={collectedCafeDetail?.ratings ?? 0} />
          </div>
          <Categories categories={collectedCafeDetail?.categories} />
          <OpenTime opening_time={collectedCafeDetail?.opening_time || ''} />
          <Location address={collectedCafeDetail?.address} />
          <PhoneNumber phone_number={collectedCafeDetail?.phone_number || ''} />

          <Comment comment={collectedCafeDetail?.comment} />
          <EatenMenus eaten={collectedCafeDetail?.eaten_menus ?? ''} />
          <Pros pros={collectedCafeDetail?.pros ?? ''} />
          <Cons cons={collectedCafeDetail?.cons ?? ''} />
        </section>

        <Button
          onClick={() => setIsCollectedFormOpenAction(true)}
        >
          수정하기
        </Button>
      </main>
    </div>
  );
}
