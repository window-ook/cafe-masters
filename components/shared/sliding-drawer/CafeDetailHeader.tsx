'use client';

import { useRouter } from 'next/navigation';
import { useUIStore, useCurrentCafeStore } from '@/stores';
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
  const router = useRouter();
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const isCollected = useCurrentCafeStore(state => state.isCollected);
  const isRecommended = useCurrentCafeStore(state => state.isRecommended);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsExtend = useUIStore(state => state.setIsExtend);

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className='flex items-center gap-2'>
        <BookmarkToggleButton bookmarkData={bookmarkData} />
        {isCollected && <CollectedBadge />}
        {isRecommended && <RecommendedBadge />}
      </div>
      <div className="flex justify-center">
        <button
          aria-label="모바일: 서브사이드바 업 다운 버튼"
          className={`${isDarkTheme ? 'bg-gray-300' : 'bg-main-400'} w-20 h-2 py-3 sm:hidden rounded-2xl flex items-center justify-center`}
          onClick={setIsExtend}
        >
          <ChevronsUpDown className='size-4 text-button-text' />
        </button>
      </div>
      <button onClick={handleClose} className='cursor-pointer'>
        <CircleX className='size-8' />
      </button>
    </header>
  );
}