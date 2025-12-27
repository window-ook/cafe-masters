'use client';

import { useCloseSlidingDrawer } from '@/hooks/ui/useCloseSlidingDrawer';
import { CircleX } from 'lucide-react';

interface ISimpleHeader {
  isDarkTheme?: boolean;
}

export default function CollectionCafeDetailHeader({
  isDarkTheme = false,
}: ISimpleHeader) {
  const handleClose = useCloseSlidingDrawer();

  return (
    <header
      className={`flex w-full items-center justify-between p-4 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}
    >
      <div />
      <button
        type="button"
        aria-label="카페 상세 정보 보기 취소 버튼"
        onClick={handleClose}
        className="cursor-pointer"
      >
        <CircleX className="size-8" />
      </button>
    </header>
  );
}
