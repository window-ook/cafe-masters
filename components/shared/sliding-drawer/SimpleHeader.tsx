'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores';
import { CircleX } from 'lucide-react';

interface ISimpleHeader {
  isDarkTheme?: boolean;
}

export default function SimpleHeader({ isDarkTheme = false }: ISimpleHeader) {
  const router = useRouter();
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

  const handleClose = () => {
    setIsSlidingDrawerOpen(false);
    router.back();
  };

  return (
    <header className={`w-full p-4 flex justify-between items-center ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
      <div />
      <button
        onClick={handleClose}
        className='cursor-pointer'
        type="button"
        aria-label="카페 상세 정보 보기 취소 버튼"
      >
        <CircleX className='size-8' />
      </button>
    </header>
  );
}