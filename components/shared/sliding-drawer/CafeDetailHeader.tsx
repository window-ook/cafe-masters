'use client';

import { useRouter } from 'next/navigation';
import { useUIStore, useCurrentCafeStore } from '@/stores';
import { CircleX } from 'lucide-react';
import CollectedBadge from '@/components/shared/sliding-drawer/CollectedBadge';
import BookmarkToggleButton from '@/components/shared/sliding-drawer/BookmarkToggleButton';

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

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className='flex items-center gap-2'>
        <BookmarkToggleButton bookmarkData={bookmarkData} />
        {isCollected && <CollectedBadge />}
      </div>
      <button onClick={handleClose} className='cursor-pointer'>
        <CircleX className='size-8' />
      </button>
    </header>
  );
}