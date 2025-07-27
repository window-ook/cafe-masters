'use client';

import { useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadBookmarkedCafe } from '@/hooks/supabase/useUploadBookmarkedCafe';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/useDeleteBookmarkedCafe';
import { useSearchedCafeDetail } from '@/hooks/kakao-map/useSearchedCafeDetail';
import { useSearchedResultStore, useMapStore, useUIStore, useUserStore } from '@/stores';
import { getDetailBodyStyle } from '@/utils/styles';
import { Bookmark, CircleX } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import OpenTime from '@/components/shared/sliding-drawer/OpenTime';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Button from '@/components/shared/sliding-drawer/Button';
import Menus from '@/components/shared/sliding-drawer/Menus';

interface ISearchedCafeDetail {
  cafeId: number;
  setIsCollectedFormOpenAction: (isMemoOpen: boolean) => void;
  setIsRecommendFormOpenAction: (isMemoOpen: boolean) => void;
}

export default function SearchedCafeDetail({ cafeId, setIsCollectedFormOpenAction, setIsRecommendFormOpenAction }: ISearchedCafeDetail) {
  const router = useRouter();

  const admin = useUserStore(state => state.admin);
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const currentCoordX = useMapStore(state => state.currentCoordX);
  const currentCoordY = useMapStore(state => state.currentCoordY);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const isCollected = useMapStore(state => state.isCollected);
  const isBookmarked = useMapStore(state => state.isBookmarked);
  const setIsBookmarked = useMapStore(state => state.setIsBookmarked);

  const scrollRef = useRef<HTMLDivElement>(null);

  // React Query로 카페 상세 정보 가져오기
  const { searchedCafeDetail } = useSearchedCafeDetail(cafeId.toString());

  const { uploadBookmarkedCafe } = useUploadBookmarkedCafe();
  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();

  // searchResult에서 cafeId에 해당하는 카페 찾기
  const detail = useMemo(() => {
    const foundCafe = searchResult.find(cafe => Number(cafe.id) === cafeId);

    if (!foundCafe) {
      return {
        id: cafeId,
        name: '카페 정보를 찾을 수 없습니다',
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
      image: '', // 카카오맵 API에서는 이미지를 제공하지 않음
      address: foundCafe.road_address_name || foundCafe.address_name,
      phone_number: foundCafe.phone || '',
      categories: foundCafe.category_name ? foundCafe.category_name.split(' > ') : [],
      open_time: '', // 카카오맵 API에서는 운영시간을 제공하지 않음
    };
  }, [searchResult, cafeId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.9;
    scrollRef.current.scrollTo({
      left:
        direction === 'left'
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount * 0.6,
      behavior: 'smooth',
    });
  };

  const handleBookmarkToggle = async () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      if (isBookmarked) {
        await deleteBookmarkedCafe(Number(detail.id));
        setIsBookmarked(false);
        toast.success('북마크에서 제거되었습니다.');
      } else {
        await uploadBookmarkedCafe({
          user_id: userId,
          id: Number(detail.id),
          name: detail.name,
          address: detail.address,
          phone_number: detail.phone_number,
          image: detail.image,
          coordX: currentCoordX,
          coordY: currentCoordY,
        });
        setIsBookmarked(true);
        toast.success('북마크에 추가되었습니다.');
      }
    } catch {
      toast.error('작업 중 오류가 발생했습니다.');
    }
  };

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
      <header className={`p-2 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className="flex justify-between items-center p-4 w-full">
          <button onClick={handleBookmarkToggle} className='cursor-pointer'>
            <Bookmark className={`size-8 ${isBookmarked ? 'text-bookmark fill-bookmark' : 'text-unbookmark'}`} />
          </button>
          <button onClick={handleClose} className='cursor-pointer'>
            <CircleX className='size-8' />
          </button>
        </div>
      </header>

      {/* 바디 */}
      <main className={`p-2 overflow-y-auto flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <div className="p-4 space-y-6">
          {/* 카페 이미지 */}
          {searchedCafeDetail.image && (
            <div className={`pb-2 flex flex-col gap-4 shadow-sm shadow-main/10 rounded-md`}>
              <section className="relative flex flex-col items-center">
                <button
                  onClick={() => handleScroll('left')}
                  className={`absolute left-0 z-10 px-2 py-1 shadow-md rounded-md top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'bg-main' : 'bg-white/30'}`}
                >
                  <span className={`${isDarkTheme ? '' : 'text-main'}`}>◀</span>
                </button>
                {/* 카페 이미지 슬라이드 */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
                >
                  <div className="snap-center shrink-0 h-60 py-2">
                    {searchedCafeDetail?.image && (
                      <a
                        data-cy="normal-detail-thumbnail"
                        onClick={() =>
                          window.open(
                            `http://place.map.kakao.com/${detail?.id}`,
                            '_blank',
                          )
                        }
                      >
                        <Image
                          src={searchedCafeDetail.image}
                          alt="카페 썸네일"
                          width={340}
                          height={240}
                          priority={true}
                          className="w-[20rem] h-full rounded-md object-cover transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
                        />
                      </a>
                    )}
                  </div>
                  {searchedCafeDetail?.extra_images?.map((photo, i) => {
                    return (
                      <div key={i} className="snap-center py-2 shrink-0 h-60">
                        <Image
                          key={photo}
                          data-cy="normal-detail-thumbnail"
                          alt="카페 썸네일"
                          src={photo || '/image/cafe_thumbnail.avif'}
                          width={340}
                          height={240}
                          className="w-[20rem] h-full rounded-md object-cover transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
                          priority={true}
                          onClick={() =>
                            window.open(
                              `http://place.map.kakao.com/${detail?.id}`,
                              '_blank',
                            )
                          }
                        />
                      </div>
                    );
                  })}
                  <button
                    className={`absolute right-0 z-10 px-2 py-1 shadow-md rounded-md top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'bg-main' : 'bg-white/30'}`}
                    onClick={() => handleScroll('right')}
                  >
                    <span className={`${isDarkTheme ? '' : 'text-main'}`}>▶</span>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* 카페 정보 */}
          <div className="space-y-4">
            {/* 카페 이름 */}
            <h1 className="text-2xl font-bold">{detail.name}</h1>
            {/* 주소 */}
            <Location address={detail.address} />
            {/* 전화번호 */}
            <PhoneNumber phone_number={detail.phone_number} />
            {/* 분류 */}
            {detail.categories && detail.categories.length > 0 && (
              <div className="col-span-2 grid grid-cols-3">
                <p className="col-span-1">분류</p>
                <div className="col-span-2 flex flex-wrap gap-2">
                  {detail.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* 운영시간 */}
            <OpenTime opening_time={searchedCafeDetail.opening_time || ''} />
            {/* 수집 상태 배지 */}
            {isCollected && <CollectedBadge />}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCollectedFormOpenAction(true)}
              customClassName='flex-1'
            >
              수집하기
            </Button>
            {admin && (
              <Button
                onClick={() => setIsRecommendFormOpenAction(true)}
                customClassName='flex-1 bg-blue-600'
              >
                추천하기
              </Button>
            )}
          </div>

          {/* 메뉴 표시 */}
          <Menus menus={searchedCafeDetail?.menus} />
        </div>
      </main>
    </div>
  );
}