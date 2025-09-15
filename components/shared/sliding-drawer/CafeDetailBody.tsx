'use client';

import { RefObject, useRef, ReactNode } from 'react';
import { useUIStore } from '@/stores';
import { scrollThumbnails } from '@/utils/shared/detail';
import { IMAGE_PATHS } from '@/lib/paths';
import { FolderCheck } from 'lucide-react';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import OpenTime from '@/components/shared/sliding-drawer/OpenTime';
import Menus from '@/components/shared/sliding-drawer/Menus';
import Categories from '@/components/shared/sliding-drawer/Categories';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import Image from 'next/image';

interface ICafeDetailBody {
  cafeId: number;
  cafeData: {
    name: string;
    address: string;
    phone_number: string;
    image: string;
    extra_images?: string[];
    opening_time?: string | null;
    menus?: { name: string; price: string; description?: string; }[] | null;
    categories?: string[];
    kakaoCategories?: string[];
  };
  useImageWithFallback?: boolean;
  actionButtons: ReactNode;
  isDetailLoading?: boolean;
}

export default function CafeDetailBody({
  cafeId,
  cafeData,
  actionButtons,
  useImageWithFallback = false,
  isDetailLoading = false
}: ICafeDetailBody) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <main className="overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 flex-1">
      {/* 카페 이미지 */}
      {(cafeData.image || isDetailLoading) && (
        <section
          key={`${cafeId}-image-section`}
          className="relative shadow-sm shadow-main/10 rounded-md flex flex-col items-center gap-4">
          <button
            type="button"
            aria-label="카페 이미지 슬라이드 왼쪽으로 이동"
            onClick={() => scrollThumbnails('left', scrollRef as RefObject<HTMLDivElement>)}
            className="slide-images-button left-0 bg-white/30"
          >
            <span className='text-main'>◀</span>
          </button>

          {/* 카페 이미지 슬라이드 */}
          <div
            ref={scrollRef}
            className="w-full max-w-full overflow-x-auto overflow-y-hidden flex gap-4 scrollbar-hide snap-x snap-mandatory"
          >
            {isDetailLoading && !cafeData.image ? (
              <div className="h-60 py-2 snap-center shrink-0">
                <div className="w-[340px] h-[240px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
              </div>
            ) : (
              <>
                <div className="h-60 py-2 snap-center shrink-0">
                  <a
                    type="button"
                    aria-label="카페 이미지 클릭 시 카카오플레이스 이동(썸네일)"
                    onClick={() => window.open(`http://place.map.kakao.com/${cafeId}`, '_blank')}
                  >
                    {useImageWithFallback ? (
                      <ImageWithFallback
                        key={`${cafeId}-main-image-${cafeData.image}`}
                        alt="카페 썸네일"
                        src={cafeData.image}
                        fallbackSrc={IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK}
                        width={340}
                        height={240}
                        priority={true}
                        quality={100}
                        className="slide-images"
                      />
                    ) : (
                      <Image
                        key={`${cafeId}-main-image-${cafeData.image}`}
                        alt="카페 썸네일"
                        src={cafeData.image}
                        width={340}
                        height={240}
                        priority={true}
                        quality={100}
                        className="slide-images"
                      />
                    )}
                  </a>
                </div>

                {cafeData.extra_images?.map((photo, i) => (
                  <div
                    key={`${cafeId}-extra-${i}`}
                    className="h-60 py-2 snap-center shrink-0"
                  >
                    <a
                      type="button"
                      aria-label="카페 이미지 클릭 시 카카오플레이스 이동"
                      onClick={() => window.open(`http://place.map.kakao.com/${cafeId}`, '_blank')}
                    >
                      {useImageWithFallback ? (
                        <ImageWithFallback
                          key={`${cafeId}-extra-image-${i}`}
                          alt="카페 썸네일"
                          src={photo}
                          fallbackSrc={IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK}
                          width={340}
                          height={240}
                          priority={true}
                          quality={100}
                          className="slide-images"
                        />
                      ) : (
                        <Image
                          key={`${cafeId}-extra-image-${i}`}
                          alt="카페 썸네일"
                          src={photo}
                          width={340}
                          height={240}
                          priority={true}
                          quality={100}
                          className="slide-images"
                        />
                      )}
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>

          <button
            className="slide-images-button right-0 bg-white/30"
            onClick={() => scrollThumbnails('right', scrollRef as RefObject<HTMLDivElement>)}
          >
            <span className='text-main'>▶</span>
          </button>
        </section>
      )}

      {/* 카페 정보 */}
      <section className="space-y-4">
        {/* 카페 이름 */}
        <h1 className="text-2xl font-bold">{cafeData.name}</h1>

        {/* 카테고리 (수집, 추천 카페) */}
        {cafeData.categories && cafeData.categories.length > 0 && (<Categories categories={cafeData.categories} />)}

        {/* 주소 */}
        <Location address={cafeData.address} />

        {/* 전화번호 */}
        <PhoneNumber phone_number={cafeData.phone_number} />

        {/* 카카오맵 분류 (검색 결과) */}
        {cafeData.kakaoCategories && cafeData.kakaoCategories.length > 0 && (
          <div className="col-span-2 grid grid-cols-3">
            <div className='flex items-center gap-2'>
              <FolderCheck className='size-4' />
              <p className="col-span-1 font-medium">분류</p>
            </div>
            <div className="col-span-2 flex flex-wrap gap-2">
              {cafeData.kakaoCategories.map((category, index) => (
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
        <OpenTime
          opening_time={cafeData.opening_time ?? null}
          isLoading={isDetailLoading}
        />
      </section>

      {/* 수집, 추천 버튼 */}
      <section className="flex gap-2">{actionButtons}</section>

      {/* 메뉴 */}
      <Menus
        menus={cafeData.menus}
        isDarkTheme={isDarkTheme}
        isLoading={isDetailLoading}
      />
    </main>
  );
}