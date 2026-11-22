'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useSearchedResultStore,
  useCurrentCafeStore,
  useUserStore,
  useRecommendationStore,
} from '@/stores';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';
import CollectButton from '@/components/opening/CollectButton';

interface ISearchCafePreDetail {
  cafeId: number;
  setIsRecommendFormOpenAction: (isMemoOpen: boolean) => void;
}

export default function SearchCafeDetail({
  cafeId,
  setIsRecommendFormOpenAction,
}: ISearchCafePreDetail) {
  const router = useRouter();

  const isAdmin = useUserStore(state => state.isAdmin);
  const session = useUserStore(state => state.session);
  const currentCoordX = useCurrentCafeStore(state => state.currentCoordX);
  const currentCoordY = useCurrentCafeStore(state => state.currentCoordY);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const setTargetCafeForRecommend = useRecommendationStore(
    state => state.setTargetCafeForRecommend,
  );

  // 즉시 렌더링: 검색 결과에 포함된 기본 정보
  const foundCafe = useMemo(() => {
    if (!searchResult || searchResult.length === 0) return null;
    const cafe = searchResult.find(cafe => Number(cafe.id) === cafeId);
    return cafe || null;
  }, [searchResult, cafeId]);

  // 검색 결과의 실시간 정보만 씁니다. 사진·메뉴·영업시간은 카카오맵 링크로 봅니다
  const getSearchDetail = () => {
    if (!foundCafe) {
      return {
        id: cafeId.toString(),
        name: '카페 정보 로딩 중...',
        address: '',
        kakaoCategories: [],
      };
    }

    return {
      id: foundCafe.id,
      name: foundCafe.place_name,
      address: foundCafe.road_address_name ?? foundCafe.address_name,
      kakaoCategories: foundCafe.category_name
        ? foundCafe.category_name.split(' > ')
        : [],
    };
  };
  const searchDetail = getSearchDetail();

  const bookmarkData = {
    id: Number(searchDetail.id),
    name: searchDetail.name,
    address: searchDetail.address,
    coordX: currentCoordX,
    coordY: currentCoordY,
  };

  const actionButtons = (
    <>
      {/* 이미 수집한 카페도 다시 수집할 수 있습니다. 수집 배지는 헤더에 그대로 남습니다 */}
      {session && (
        <CollectButton
          target={
            foundCafe && currentCoordX && currentCoordY
              ? {
                  placeId: searchDetail.id,
                  name: searchDetail.name,
                  address: searchDetail.address,
                  coordX: currentCoordX,
                  coordY: currentCoordY,
                }
              : null
          }
        />
      )}

      {isAdmin && !isRecommended && (
        <Button
          onClick={() => {
            setTargetCafeForRecommend({
              id: Number(searchDetail.id),
              name: searchDetail.name,
              coordX: currentCoordX,
              coordY: currentCoordY,
              address: searchDetail.address,
            });
            setIsRecommendFormOpenAction(true);
          }}
          customClassName="bg-blue-600 flex-1 hover:bg-blue-800"
        >
          <span>추천하기</span>
        </Button>
      )}

      {/* 로그아웃 상태 */}
      {!session && (
        <Button onClick={() => router.push('/signin')} customClassName="flex-1">
          <span>로그인하고 수집하기</span>
        </Button>
      )}
    </>
  );

  return (
    <article className="flex h-full flex-col rounded-md">
      <CafeDetailHeader bookmarkData={bookmarkData} />
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={searchDetail}
        actionButtons={actionButtons}
      />
    </article>
  );
}
