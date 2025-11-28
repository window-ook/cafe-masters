'use client';

import { useUIStore, useCurrentCafeStore } from '@/stores';
import { useCloseSlidingDrawer } from '@/hooks/ui/useCloseSlidingDrawer';
import { CircleX, ChevronsUpDown } from 'lucide-react';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import BookmarkToggleButton from '@/components/shared/sliding-drawer/BookmarkToggleButton';
import RecommendedBadge from '@/components/shared/sliding-drawer/RecommendedBadge';

interface ICafeDetailHeader {
  bookmarkData: {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    image: string;
    coordX: number;
    coordY: number;
    extra_images: string[] | null;
    opening_time: string | null;
    menus?: { name: string; price: string; }[] | null;
  };
}

export default function CafeDetailHeader({ bookmarkData }: ICafeDetailHeader) {
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsExtend = useUIStore(state => state.setIsExtend);

  const handleClose = useCloseSlidingDrawer();
  return (
    <header className="w-full p-4">
      {/* PC 레이아웃: 한 줄에 모든 요소 배치 */}
      <div className='hidden sm:flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <BookmarkToggleButton bookmarkData={bookmarkData} />
          {isRecommended && <RecommendedBadge />}
          {isCollected && <CollectedBadge />}
        </div>
        <button aria-label="카페 상세 정보 보기 취소 버튼" onClick={handleClose} className='cursor-pointer'>
          <CircleX className='size-8' />
        </button>
      </div>

      {/* 모바일 레이아웃: 2줄로 분리 */}
      <div className='sm:hidden flex flex-col gap-2'>
        {/* 첫 번째 줄: 북마크 + 드로어 조절 + 닫기 버튼 */}
        <div className='flex items-center justify-between'>
          <BookmarkToggleButton bookmarkData={bookmarkData} />
          <button
            aria-label="모바일: 서브사이드바 업 다운 버튼"
            className={`${isDarkTheme ? 'bg-gray-300' : 'bg-main-400'} w-20 h-2 py-3 rounded-2xl flex items-center justify-center`}
            onClick={setIsExtend}
          >
            <ChevronsUpDown className='size-4 text-button-text' />
          </button>
          <button aria-label="카페 상세 정보 보기 취소 버튼" onClick={handleClose} className='cursor-pointer'>
            <CircleX className='size-8' />
          </button>
        </div>

        {/* 두 번째 줄: 추천/수집 뱃지 */}
        <div className='flex items-center gap-2'>
          {isRecommended && <RecommendedBadge />}
          {isCollected && <CollectedBadge />}
        </div>
      </div>
    </header>
  );
}