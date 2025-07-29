'use client';

import { RefObject, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteBookmarkedCafe } from '@/hooks/supabase/bookmark';
import { useBookmarkedCafes } from '@/hooks/supabase/bookmark/useBookmarkedCafes';
import { useCreateCollectedCafe } from '@/hooks/supabase/collection';
import { useCurrentCafeStore, useUIStore, useUserStore } from 'stores';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { scrollThumbnails } from '@/utils/shared/detail';
import { Bookmark, CircleX } from 'lucide-react';
import { toast } from 'react-toastify';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import Location from '@/components/shared/sliding-drawer/Location';
import PhoneNumber from '@/components/shared/sliding-drawer/PhoneNumber';
import Button from '@/components/shared/sliding-drawer/Button';
import OpenTime from './OpenTime';
import Menus from './Menus';
import ImageWithFallback from '../ImageWithFallback';

export default function BookmarkedCafeDetail({ cafeId }: { cafeId: number }) {
  const router = useRouter();

  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const setIsBookmarked = useCurrentCafeStore(state => state.setIsBookmarked);

  const { deleteBookmarkedCafe } = useDeleteBookmarkedCafe();
  const { filteredBookmarkedCafes } = useBookmarkedCafes(userId);
  const { selectTargetCafeForCollect } = useCreateCollectedCafe();

  const scrollRef = useRef<HTMLDivElement>(null);

  const detail = filteredBookmarkedCafes.find((cafe: ISupabaseBookmarkedCafe) => cafe.id === Number(cafeId));

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const handleBookmarkDelete = async () => {
    if (!userId) return;

    try {
      await deleteBookmarkedCafe(detail.id);
      setIsBookmarked(false);
      toast.success('북마크가 해제되었습니다.');
      handleClose();
    } catch {
      toast.error('북마크 해제 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <div className={`h-full rounded-md flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : ''}`}>
      {/* 헤더 */}
      <header className={`w-full p-4 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className='flex items-center gap-2'>
          <button onClick={handleBookmarkDelete} className='cursor-pointer'>
            <Bookmark className="size-8 text-bookmark fill-bookmark" />
          </button>
          {/* 수집 상태 배지 */}
          {isCollected && <CollectedBadge />}
        </div>
        <button onClick={handleClose} className='cursor-pointer'>
          <CircleX className='size-8' />
        </button>
      </header>

      {/* 바디 */}
      <main className={`p-4 overflow-y-auto flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <div className="space-y-6">
          {/* 카페 이미지 */}
          {detail.image && (
            <section className="relative shadow-sm shadow-main/10 rounded-md flex flex-col items-center gap-4 ">
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
                  {detail?.image && (
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
                        alt="카페 썸네일"
                        src={detail.image}
                        fallbackSrc={'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif'}
                        width={340}
                        height={240}
                        priority={true}
                        className="slide-images"
                      />
                    </a>
                  )}
                </div>
                {detail?.extra_images?.map((photo, i) => {
                  return (
                    <div
                      key={i}
                      className="h-60 py-2 snap-center shrink-0">
                      <ImageWithFallback
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
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{detail.name}</h1>
            <Location address={detail.address} />
            <PhoneNumber phone_number={detail.phone_number!} />
            <OpenTime opening_time={detail.opening_time || '등록 X'} />
          </div>

          {/* 액션 버튼들 */}
          <section className="flex gap-2">
            <Button
              onClick={() => selectTargetCafeForCollect({
                id: detail.id,
                name: detail.name,
                coordX: detail.coordX,
                coordY: detail.coordY,
                address: detail.address,
                image: detail.image,
                extra_images: detail.extra_images || [],
                phone_number: detail.phone_number,
                opening_time: detail.opening_time,
              })}
              customClassName='flex-1'
            >
              수집하기
            </Button>
          </section>

          <Menus menus={detail.menus ? (() => {
            try {
              return JSON.parse(detail.menus);
            } catch {
              return null;
            }
          })() : null} />
        </div>
      </main>
    </div>
  );
}