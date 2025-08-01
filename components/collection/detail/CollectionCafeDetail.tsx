'use client';

import { RefObject, useRef } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { useCollectionStore } from '@/stores/collection';
import { useCollectedCafes } from '@/hooks/supabase/collection';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { scrollThumbnails } from '@/utils/shared/detail';
import Image from 'next/image';
import Ratings from '@/components/shared/sliding-drawer/Ratings';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Comment from '@/components/shared/sliding-drawer/Comment';
import EatenMenus from '@/components/shared/sliding-drawer/EatenMenus';
import Pros from '@/components/shared/sliding-drawer/Pros';
import Cons from '@/components/shared/sliding-drawer/Cons';
import OpenTime from '@/components/shared/sliding-drawer/OpenTime';
import Categories from '@/components/shared/sliding-drawer/Categories';
import Button from '@/components/shared/Button';
import CollectionCafeDetailHeader from '@/components/collection/detail/CollectionCafeDetailHeader';

export default function CollectionCafeDetail({ cafeId }: { cafeId: number }) {
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);
  const setEditingCafe = useCollectionStore(state => state.setEditingCafe);

  const { filteredCollectedCafes } = useCollectedCafes(userId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const collectedCafeDetail = filteredCollectedCafes.find((cafe: ISupabaseCollectedCafe) => cafe.id === cafeId);

  if (!collectedCafeDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-md flex flex-col">
      <CollectionCafeDetailHeader isDarkTheme={isDarkTheme} />

      {/* 바디 */}
      <main className={`overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <section
          key={`${cafeId}-image-section`}
          className="relative shadow-sm shadow-main/10 rounded-md flex flex-col items-center gap-4 ">
          <button
            type="button"
            aria-label="카페 이미지 슬라이드 왼쪽으로 이동"
            onClick={() => scrollThumbnails('left', scrollRef as RefObject<HTMLDivElement>)}
            className={`slide-images-button left-0 ${isDarkTheme ? 'bg-main' : 'bg-white/30'}`}
          >
            <span className={`${isDarkTheme ? '' : 'text-main'}`}>◀</span>
          </button>
          {/* 카페 이미지 슬라이드 */}
          <div
            ref={scrollRef}
            className="w-full max-w-full overflow-x-auto overflow-y-hidden flex gap-4 scrollbar-hide snap-x snap-mandatory"
          >
            <div className="h-60 py-2 snap-center shrink-0">
              {collectedCafeDetail?.image && (
                <a
                  type="button"
                  aria-label="카페 이미지 클릭 시 카카오플레이스 이동"
                  onClick={() =>
                    window.open(
                      `http://place.map.kakao.com/${collectedCafeDetail?.id}`,
                      '_blank',
                    )
                  }
                >
                  <Image
                    key={`${cafeId}-main-image`}
                    alt="카페 썸네일"
                    src={collectedCafeDetail.image}
                    width={340}
                    height={240}
                    priority={true}
                    className="slide-images"
                  />
                </a>
              )}
            </div>
            {collectedCafeDetail?.extra_images && Array.isArray(collectedCafeDetail.extra_images) && collectedCafeDetail.extra_images.length > 0 && collectedCafeDetail.extra_images.map((photo, i) => {
              return (
                <div
                  key={`${cafeId}-extra-${i}`}
                  className="h-60 py-2 snap-center shrink-0">
                  <Image
                    key={`${cafeId}-extra-image-${i}`}
                    alt="카페 썸네일"
                    src={photo}
                    width={340}
                    height={240}
                    priority={true}
                    onClick={() =>
                      window.open(
                        `http://place.map.kakao.com/${collectedCafeDetail?.id}`,
                        '_blank',
                      )
                    }
                    className="slide-images"
                  />
                </div>
              );
            })}
            <button
              className={`slide-images-button right-0 ${isDarkTheme ? 'bg-main' : 'bg-white/30'}`}
              onClick={() => scrollThumbnails('right', scrollRef as RefObject<HTMLDivElement>)}
            >
              <span className={`${isDarkTheme ? '' : 'text-main'}`}>▶</span>
            </button>
          </div>
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
          onClick={() => {
            setEditingCafe(collectedCafeDetail);
            setIsCollectFormOpen(true);
          }}
        >
          수정하기
        </Button>
      </main>
    </div>
  );
}