'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchCafeDetail } from '@/hooks/kakao-map/useSearchCafeDetail';
import { useSearchedResultStore, useCurrentCafeStore, useUserStore, useUIStore, useCollectionStore, useRecommendationStore } from '@/stores';
import { LoadingSpinner } from '@/components/shared/sliding-drawer/LoadingSpinner';
import { IMAGE_PATHS } from '@/lib/paths';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';

/** 슬라이딩 드로어에서 넘겨받는 카페 ID와 추천 폼 열기 액션 함수 */
interface ISearchCafePreDetail {
  cafeId: number;
  setIsRecommendFormOpenAction: (isMemoOpen: boolean) => void;
}

export default function SearchCafeDetail({ cafeId, setIsRecommendFormOpenAction }: ISearchCafePreDetail) {
  const router = useRouter();

  const admin = useUserStore(state => state.admin);
  const userId = useUserStore(state => state.userId);
  const currentCoordX = useCurrentCafeStore(state => state.currentCoordX);
  const currentCoordY = useCurrentCafeStore(state => state.currentCoordY);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const setIsCollectFormOpen = useUIStore(state => state.setIsCollectFormOpen);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const setTargetCafeForRecommend = useRecommendationStore(state => state.setTargetCafeForRecommend);
  const setTargetCafeForCollect = useCollectionStore(state => state.setTargetCafeForCollect);

  const { searchedCafeDetail, isLoading: isDetailLoading } = useSearchCafeDetail(cafeId.toString());

  // 즉시 렌더링: 검색 결과에 포함된 기본 정보
  const foundCafe = useMemo(() => {
    if (!searchResult || searchResult.length === 0) return null; // 새로고침 고려
    const cafe = searchResult.find(cafe => Number(cafe.id) === cafeId);
    return cafe || null;
  }, [searchResult, cafeId]);

  // 점진적 렌더링: 기본 정보 즉각 업데이트 + 카페 상세 정보 데이터 비동기 페칭 후 업데이트
  const searchedDetail = useMemo(() => {
    if (!foundCafe) {
      return {
        id: cafeId.toString(),
        name: '카페 정보 로딩 중...',
        image: IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK,
        address: '',
        phone_number: '',
        kakaoCategories: [],
        extra_images: searchedCafeDetail?.extra_images ?? [],
        opening_time: searchedCafeDetail?.opening_time ?? null,
      };
    }

    return {
      id: foundCafe.id,
      name: foundCafe.place_name,
      image: searchedCafeDetail?.image || IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK,
      address: foundCafe.road_address_name ?? foundCafe.address_name,
      phone_number: foundCafe.phone ?? '',
      kakaoCategories: foundCafe.category_name ? foundCafe.category_name.split(' > ') : [],
      extra_images: searchedCafeDetail?.extra_images ?? [],
      opening_time: searchedCafeDetail?.opening_time ?? null,
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
  };

  const actionButtons = (
    <>
      {/* 로그인 & 수집하지 않은 상태 */}
      {userId && !isCollected &&
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
          {isDetailLoading ? <LoadingSpinner size="sm" /> : <span>수집하기</span>}
        </Button>}

      {/* 관리자 & 추천하지 않은 상태 */}
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
          customClassName='flex-1 bg-blue-600 hover:bg-blue-800'
        >
          {isDetailLoading ? <LoadingSpinner size="sm" /> : <span>추천하기</span>}
        </Button>
      )}

      {/* 로그아웃 상태 */}
      {!userId && <Button onClick={() => router.push('/signin')} customClassName='flex-1'>
        {isDetailLoading ? <LoadingSpinner size="sm" /> : <span>로그인하고 수집하기</span>}
      </Button>}
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