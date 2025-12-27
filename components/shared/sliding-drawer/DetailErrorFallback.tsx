'use client';

import { CircleX } from 'lucide-react';
import { useCloseSlidingDrawer } from '@/hooks/ui/useCloseSlidingDrawer';

export default function DetailErrorFallback() {
  const handleClose = useCloseSlidingDrawer();

  return (
    <div className={`flex h-full flex-col`}>
      {/* 헤더 */}
      <header className={`flex items-center justify-between rounded-md p-2`}>
        <div className="flex w-full items-center justify-between p-4">
          <button
            aria-label="카페 상세 정보 보기 취소 버튼"
            onClick={handleClose}
          >
            <CircleX className="size-8" />
          </button>
        </div>
      </header>

      {/* 에러 메시지 */}
      <main
        className={`flex flex-1 flex-col gap-4 overflow-y-auto rounded-md p-2 shadow-md`}
      >
        <div className="flex h-full flex-col items-center justify-center space-y-6 p-4">
          <div className="text-center text-gray-500">
            <p className="mb-2 text-lg font-medium">
              카페 정보를 찾을 수 없습니다
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
