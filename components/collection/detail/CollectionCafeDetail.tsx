'use client';

import { RefObject, useMemo, useRef } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { useCollectionStore } from '@/stores/collection';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
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
  const setEditingCafeForCollect = useCollectionStore(state => state.setEditingCafeForCollect);

  const { filteredCollectionCafes } = useCollectionCafes(userId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const collectionCafeDetail = useMemo(() => filteredCollectionCafes.find((cafe: ISupabaseCollectionCafe) => cafe.id === cafeId), [filteredCollectionCafes, cafeId]);

  if (!collectionCafeDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <article className="h-full rounded-md flex flex-col">
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
              {collectionCafeDetail?.image && (
                <button
                  type="button"
                  aria-label="카페 이미지 클릭 시 카카오플레이스 이동"
                  className="cursor-pointer"
                  onClick={() => window.open(`http://place.map.kakao.com/${collectionCafeDetail?.id}`, '_blank')}
                >
                  <Image
                    key={`${cafeId}-main-image`}
                    alt="카페 썸네일"
                    src={collectionCafeDetail.image}
                    width={340}
                    height={240}
                    priority={true}
                    className="slide-images"
                  />
                </button>
              )}
            </div>
            {collectionCafeDetail?.extra_images && Array.isArray(collectionCafeDetail.extra_images) && collectionCafeDetail.extra_images.length > 0 && collectionCafeDetail.extra_images.map((photo, i) => {
              return (
                <div
                  key={`${cafeId}-extra-${i}`}
                  className="h-60 py-2 snap-center shrink-0">
                  <button
                    type="button"
                    aria-label="카페 이미지 클릭 시 카카오플레이스 이동"
                    className="cursor-pointer"
                    onClick={() => window.open(`http://place.map.kakao.com/${collectionCafeDetail?.id}`, '_blank')}
                  >
                    <Image
                      key={`${cafeId}-extra-image-${i}`}
                      alt="카페 썸네일"
                      src={photo}
                      width={340}
                      height={240}
                      priority={true}
                      className="slide-images"
                    />
                  </button>
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
            <h1 className="text-2xl font-semibold">{collectionCafeDetail?.name}</h1>
            <Ratings rating={collectionCafeDetail?.ratings ?? 0} />
          </div>
          <Categories categories={collectionCafeDetail?.categories} />
          <OpenTime opening_time={collectionCafeDetail?.opening_time || null} />
          <Location address={collectionCafeDetail?.address} />
          <PhoneNumber phone_number={collectionCafeDetail?.phone_number || null} />

          <Comment comment={collectionCafeDetail?.comment} />
          <EatenMenus eaten={collectionCafeDetail?.eaten_menus ?? null} />
          <Pros pros={collectionCafeDetail?.pros ?? ''} />
          <Cons cons={collectionCafeDetail?.cons ?? ''} />
        </section>

        <Button
          dataTestId="button-collect-edit"
          onClick={() => {
            setEditingCafeForCollect(collectionCafeDetail);
            setIsCollectFormOpen(true);
          }}
        >
          수정하기
        </Button>
      </main>
    </article>
  );
}