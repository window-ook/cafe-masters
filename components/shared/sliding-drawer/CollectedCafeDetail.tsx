'use client';

import { useRouter } from 'next/navigation';
import { useUIStore, useUserStore } from 'stores';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
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

export default function CollectedCafeDetail({ cafeId, setIsCollectedFormOpenAction }: { cafeId: number; setIsCollectedFormOpenAction: (open: boolean) => void }) {
  const router = useRouter();

  const { userId } = useUserStore();
  const { isDarkTheme, setIsSlidingDrawerOpen } = useUIStore();

  // React Query 캐시에서 수집된 카페 데이터 가져오기
  const { filteredData: collectedCafes } = useCollectedCafes(userId, true);
  // 카페 id로 해당 카페의 상세 정보 조회
  const collectedCafeDetail = collectedCafes.find((cafe: ISupabaseCollectedCafe) => cafe.id === Number(cafeId));

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
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          <span className="text-[1.375rem] font-dpixel font-semibold">
            {collectedCafeDetail?.name}
          </span>
        </div>
        <button
          type="button"
          aria-label="수집한 카드 상세 정보 보기 취소 버튼"
          onClick={handleSetIsSubSidebarOpen}
          className="px-2 right-2"
        >
          <IoCloseCircle className="text-main text-3xl hover:text-opacity-70" />
        </button>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
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
        </div>

        <div className="flex justify-between items-center">
          <Ratings rating={collectedCafeDetail?.ratings ?? 0} />
          <button
            type="button"
            data-cy="update-button"
            className="px-3 py-2 bg-red-400 rounded-lg font-bold font-pretendard text-white hover:bg-opacity-70 transition duration-200 ease"
            onClick={() => setIsCollectedFormOpenAction(true)}
          >
            수정하기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Categories categories={collectedCafeDetail?.categories} />
          <OpenTime opening_time={collectedCafeDetail?.opening_time || ''} />
          <Location address={collectedCafeDetail?.address} />
          <PhoneNumber phone_number={collectedCafeDetail?.phone_number || ''} />

          <div className="col-span-2 grid grid-cols-3">
            <div className="bg-gray-400 bg-opacity-40 h-0.5 col-span-3"></div>
          </div>
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-2 font-dpixel text-2xl">CARD SPEC</div>
          </div>

          <Comment comment={collectedCafeDetail?.comment} />
          <EatenMenus eaten={collectedCafeDetail?.eaten_menus ?? ''} />
          <Pros pros={collectedCafeDetail?.pros ?? ''} />
          <Cons cons={collectedCafeDetail?.cons ?? ''} />
        </div>
      </div>
    </div>
  );
}
