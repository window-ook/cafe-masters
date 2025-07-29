'use client';

import { useRouter } from 'next/navigation';
import { useRef, useMemo, RefObject } from 'react';
import { useSearchedCafeDetail } from '@/hooks/kakao-map/useSearchedCafeDetail';
import { useCreateCollectedCafe } from '@/hooks/supabase/collection';
import { useSearchedResultStore, useMapStore, useUIStore, useUserStore } from '@/stores';
import { scrollThumbnails } from '@/utils/shared/detail';
import { getDetailBodyStyle } from '@/utils/styles';
import { CircleX, FolderCheck } from 'lucide-react';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import OpenTime from '@/components/shared/sliding-drawer/OpenTime';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Button from '@/components/shared/sliding-drawer/Button';
import Menus from '@/components/shared/sliding-drawer/Menus';
import ImageWithFallback from '../ImageWithFallback';
import BookmarkToggleButton from './BookmarkToggleButton';

interface ISearchedCafeDetail {
  cafeId: number;
  setIsRecommendFormOpenAction: (isMemoOpen: boolean) => void;
}

export default function SearchedCafeDetail({ cafeId, setIsRecommendFormOpenAction }: ISearchedCafeDetail) {
  const router = useRouter();

  const admin = useUserStore(state => state.admin);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const currentCoordX = useMapStore(state => state.currentCoordX);
  const currentCoordY = useMapStore(state => state.currentCoordY);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const isCollected = useMapStore(state => state.isCollected);

  const { selectTargetCafeForCollect } = useCreateCollectedCafe();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { searchedCafeDetail } = useSearchedCafeDetail(cafeId.toString());

  const detail = useMemo(() => {
    const foundCafe = searchResult.find(cafe => Number(cafe.id) === cafeId);

    if (!foundCafe) {
      return {
        id: cafeId,
        name: '카페를 찾을 수 없습니다',
        image: '',
        address: '',
        phone_number: '',
        categories: [],
        open_time: '',
      };
    }

    return {
      id: foundCafe.id,
      name: foundCafe.place_name,
      image: '',
      address: foundCafe.road_address_name ?? foundCafe.address_name,
      phone_number: foundCafe.phone ?? '',
      categories: foundCafe.category_name ? foundCafe.category_name.split(' > ') : [],
      open_time: '',
    };
  }, [searchResult, cafeId]);

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  if (!detail.name || detail.name === '카페 정보를 찾을 수 없습니다') {
    return (
      <div className={`h-full flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-transparent'}`}>
        {/* 헤더 */}
        <header className={`${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center rounded-md p-2`}>
          <div className="flex justify-between items-center p-4 w-full">
            <button onClick={handleClose}>
              <CircleX className='size-8' />
            </button>
          </div>
        </header>

        {/* 에러 메시지 */}
        <main className={`flex-1 overflow-y-auto ${getDetailBodyStyle(isDarkTheme)}`}>
          <div className="p-4 space-y-6 flex flex-col items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">카페 정보를 찾을 수 없습니다</p>
              <p className="text-sm">카페 ID: {cafeId}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`h-full rounded-md flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : ''}`}>
      {/* 헤더 */}
      <header className={`w-full p-4 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className='flex items-center gap-2'>
          <BookmarkToggleButton
            bookmarkData={{
              id: Number(detail.id),
              name: detail.name,
              address: detail.address,
              phone_number: detail.phone_number,
              image: searchedCafeDetail?.image ?? 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif', // 이미지는 무조건 있어야 함
              coordX: currentCoordX,
              coordY: currentCoordY,
              extra_images: searchedCafeDetail?.extra_images ?? null,
              opening_time: searchedCafeDetail?.opening_time ?? null,
              menus: searchedCafeDetail?.menus ?? null,
            }}
          />
          {/* 수집 상태 배지 */}
          {isCollected && <CollectedBadge />}
        </div>
        <button onClick={handleClose} className='cursor-pointer'>
          <CircleX className='size-8' />
        </button>
      </header>

      {/* 바디 */}
      <main className={`overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        {/* 카페 이미지 */}
        {searchedCafeDetail.image && (
          <section key={`${cafeId}-image-section`} className="relative shadow-sm shadow-main/10 rounded-md flex flex-col items-center gap-4 ">
            <button
              type="button"
              aria-label="카페 이미지 슬라이드 왼쪽으로 이동"
              onClick={() => scrollThumbnails('left', scrollRef as RefObject<HTMLDivElement>)}
              className={`absolute left-0 z-10 top-1/2 transform -translate-y-1/2 px-2 py-1 shadow-md rounded-md ${isDarkTheme ? 'bg-main' : 'bg-white/30'} cursor-pointer`}
            >
              <span className={`${isDarkTheme ? '' : 'text-main'}`}>◀</span>
            </button>
            {/* 카페 이미지 슬라이드 */}
            <div
              ref={scrollRef}
              className="w-full max-w-full overflow-x-auto overflow-y-hidden flex gap-4 scrollbar-hide snap-x snap-mandatory"
            >
              <div className="h-60 py-2 snap-center shrink-0">
                {searchedCafeDetail?.image && (
                  <a
                    type="button"
                    aria-label="카페 이미지 클릭 시 카카오플레이스 이동"
                    onClick={() =>
                      window.open(
                        `http://place.map.kakao.com/${detail?.id}`,
                        '_blank',
                      )
                    }
                  >
                    <ImageWithFallback
                      key={`${cafeId}-main-image`}
                      alt="카페 썸네일"
                      src={searchedCafeDetail.image}
                      fallbackSrc={'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif'}
                      width={340}
                      height={240}
                      priority={true}
                      className="slide-images"
                    />
                  </a>
                )}
              </div>
              {searchedCafeDetail?.extra_images?.map((photo, i) => {
                return (
                  <div
                    key={`${cafeId}-extra-${i}`}
                    className="h-60 py-2 snap-center shrink-0">
                    <ImageWithFallback
                      key={`${cafeId}-extra-image-${i}`}
                      alt="카페 썸네일"
                      src={photo}
                      fallbackSrc={'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif'}
                      width={340}
                      height={240}
                      priority={true}
                      onClick={() =>
                        window.open(
                          `http://place.map.kakao.com/${detail?.id}`,
                          '_blank',
                        )
                      }
                      className="slide-images"
                    />
                  </div>
                );
              })}
              <button
                className={`absolute right-0 z-10 px-2 py-1 top-1/2 transform -translate-y-1/2 shadow-md rounded-md ${isDarkTheme ? 'bg-main' : 'bg-white/30'} cursor-pointer`}
                onClick={() => scrollThumbnails('right', scrollRef as RefObject<HTMLDivElement>)}
              >
                <span className={`${isDarkTheme ? '' : 'text-main'}`}>▶</span>
              </button>
            </div>
          </section>
        )}

        {/* 카페 정보 */}
        <section className="space-y-4">
          {/* 카페 이름 */}
          <h1 className="text-2xl font-bold">{detail.name}</h1>
          {/* 주소 */}
          <Location address={detail.address} />
          {/* 전화번호 */}
          <PhoneNumber phone_number={detail.phone_number} />
          {/* 카카오맵 분류 */}
          {detail.categories && detail.categories.length > 0 && (
            <div className="col-span-2 grid grid-cols-3">
              <div className='flex items-center gap-2'>
                <FolderCheck className='size-4' />
                <p className="col-span-1 font-medium">분류</p>
              </div>
              <div className="col-span-2 flex flex-wrap gap-2">
                {detail.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full shadow-md text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* 운영시간 */}
          <OpenTime opening_time={searchedCafeDetail.opening_time ?? ''} />
        </section>

        {/* 액션 버튼들 */}
        <section className="flex gap-2">
          <Button
            onClick={() => selectTargetCafeForCollect({
              name: detail.name,
              coordX: currentCoordX,
              coordY: currentCoordY,
              address: detail.address,
              image: searchedCafeDetail?.image || 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif',
              extra_images: searchedCafeDetail?.extra_images || [],
              phone_number: detail.phone_number,
              opening_time: searchedCafeDetail?.opening_time || null,
            })}
            customClassName='flex-1'
          >
            수집하기
          </Button>
          {admin && <Button onClick={() => setIsRecommendFormOpenAction(true)} customClassName='flex-1 bg-blue-600'>추천하기</Button>}
        </section>

        {/* 메뉴 */}
        <Menus menus={searchedCafeDetail?.menus} />
      </main>
    </div>
  );
}