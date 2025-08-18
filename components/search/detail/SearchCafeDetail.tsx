'use client';

import { useMemo } from 'react';
import { useSearchedCafeDetail } from '@/hooks/kakao-map/useSearchedCafeDetail';
import { useSearchedResultStore, useCurrentCafeStore, useUserStore, useUIStore, useCollectionStore, useRecommendationStore } from '@/stores';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';

interface ISearchedCafeDetail {
  cafeId: number;
  setIsRecommendFormOpenAction: (isMemoOpen: boolean) => void;
}

export default function SearchCafeDetail({ cafeId, setIsRecommendFormOpenAction }: ISearchedCafeDetail) {
  const admin = useUserStore(state => state.admin);
  const currentCoordX = useCurrentCafeStore(state => state.currentCoordX);
  const currentCoordY = useCurrentCafeStore(state => state.currentCoordY);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const setTargetCafeForRecommend = useRecommendationStore(state => state.setTargetCafeForRecommend);
  const setTargetCafeForCollect = useCollectionStore(state => state.setTargetCafeForCollect);

  const { searchedCafeDetail, isLoading: isDetailLoading } = useSearchedCafeDetail(cafeId.toString());

  // 즉시 렌더링: 검색 결과에 포함된 기본 정보(클라이언트 캐시)
  const foundCafe = useMemo(() => {
    // 새로고침 시 searchResult가 비어있을 수 있으므로 안전하게 처리
    if (!searchResult || searchResult.length === 0) {
      return null;
    }
    const cafe = searchResult.find(cafe => Number(cafe.id) === cafeId);
    return cafe || null;
  }, [searchResult, cafeId]);

  // 점진적 렌더링: 기본 정보 + 카페 상세 정보 데이터 업데이트(API 응답)
  const searchedDetail = useMemo(() => {
    if (!foundCafe) {
      return {
        id: cafeId.toString(),
        name: '카페 정보 로딩 중...',
        image: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif',
        address: '',
        phone_number: '',
        kakaoCategories: [],
        extra_images: searchedCafeDetail?.extra_images ?? [],
        opening_time: searchedCafeDetail?.opening_time ?? null,
        menus: searchedCafeDetail?.menus ?? null,
      };
    }

    return {
      id: foundCafe.id,
      name: foundCafe.place_name,
      image: searchedCafeDetail?.image || 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif',
      address: foundCafe.road_address_name ?? foundCafe.address_name,
      phone_number: foundCafe.phone ?? '',
      kakaoCategories: foundCafe.category_name ? foundCafe.category_name.split(' > ') : [],
      extra_images: searchedCafeDetail?.extra_images ?? [],
      opening_time: searchedCafeDetail?.opening_time ?? null,
      menus: searchedCafeDetail?.menus ?? null,
    };
  }, [foundCafe, searchedCafeDetail, cafeId]);

  const bookmarkData = {
    id: Number(searchedDetail.id),
    name: searchedDetail.name,
    address: searchedDetail.address,
    phone_number: searchedDetail.phone_number,
    image: searchedDetail.image,
    coordX: currentCoordX,
    coordY: currentCoordY,
    extra_images: searchedDetail.extra_images,
    opening_time: searchedDetail.opening_time,
    menus: searchedDetail.menus,
  };

  const actionButtons = (
    <>
      <Button
        onClick={() => {
          setTargetCafeForCollect({
            id: Number(searchedDetail.id),
            name: searchedDetail.name,
            coordX: currentCoordX,
            coordY: currentCoordY,
            address: searchedDetail.address,
            image: searchedDetail.image,
            extra_images: searchedDetail.extra_images || [],
            phone_number: searchedDetail.phone_number,
            opening_time: searchedDetail.opening_time,
          });
          setIsCollectFormOpen(true);
        }}
        customClassName='flex-1'
      >
        {isCollected ? '수정하기' : '수집하기'}
      </Button>
      {admin && !isRecommended && (
        <Button
          onClick={() => {
            setTargetCafeForRecommend({
              id: Number(searchedDetail.id),
              name: searchedDetail.name,
              coordX: currentCoordX,
              coordY: currentCoordY,
              address: searchedDetail.address,
              image: searchedDetail.image,
              extra_images: searchedDetail.extra_images || [],
              phone_number: searchedDetail.phone_number,
              opening_time: searchedDetail.opening_time,
            });
            setIsRecommendFormOpenAction(true);
          }}
          customClassName='flex-1 bg-blue-600'
        >
          추천하기
        </Button>
      )}
    </>
  );

  return (
    <article className="h-full rounded-md flex flex-col">
      <CafeDetailHeader bookmarkData={bookmarkData} />
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={searchedDetail}
        actionButtons={actionButtons}
        useImageWithFallback={true}
        isDetailLoading={isDetailLoading}
      />
    </article>
  );
}