'use client';

import { useUIStore, useUserStore } from '@/stores';
import { useCollectionStore } from '@/stores/collection';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
import Image from 'next/image';
import Ratings from '@/components/shared/sliding-drawer/Ratings';
import Location from '@/components/shared/sliding-drawer/Location';
import KakaoMapLink from '@/components/shared/sliding-drawer/KakaoMapLink';
import Comment from '@/components/shared/sliding-drawer/Comment';
import EatenMenus from '@/components/shared/sliding-drawer/EatenMenus';
import Pros from '@/components/shared/sliding-drawer/Pros';
import Cons from '@/components/shared/sliding-drawer/Cons';
import Categories from '@/components/shared/sliding-drawer/Categories';
import Button from '@/components/shared/Button';
import CollectionCafeDetailHeader from '@/components/collection/detail/CollectionCafeDetailHeader';

export default function CollectionCafeDetail({ cafeId }: { cafeId: number }) {
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);
  const setEditingCafeForCollect = useCollectionStore(
    state => state.setEditingCafeForCollect,
  );

  const { filteredCollectionCafes } = useCollectionCafes(userId);

  const collectionCafeDetail = filteredCollectionCafes.find(
    (cafe: ISupabaseCollectionCafe) => cafe.id === cafeId,
  );

  if (!collectionCafeDetail) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-md">
      <CollectionCafeDetailHeader isDarkTheme={isDarkTheme} />

      {/* 바디 */}
      <main
        className={`flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}
      >
        {/* 사용자가 올린 사진만 보여 줍니다 */}
        {collectionCafeDetail.image && (
          <section className="shadow-main/10 flex justify-center rounded-md py-2 shadow-sm">
            <Image
              key={`${cafeId}-main-image`}
              alt="카페 사진"
              src={collectionCafeDetail.image}
              width={340}
              height={240}
              priority={true}
              className="slide-images"
            />
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {collectionCafeDetail?.name}
            </h1>
            <Ratings rating={collectionCafeDetail?.ratings ?? 0} />
          </div>
          <Categories categories={collectionCafeDetail?.categories} />
          <Location address={collectionCafeDetail?.address} />
          {/* 카드 ID와 장소 ID가 다르므로 place_id로 엽니다 */}
          <KakaoMapLink placeId={collectionCafeDetail.place_id} />

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
