'use client';

import { useUIStore } from '@/stores';
import { CircleX } from 'lucide-react';
import Skeleton from './Skeleton';

/** 카페 상세 정보 로딩 중 스켈레톤 UI */
export default function CafeDetailSkeleton() {
  const { isDarkTheme } = useUIStore();

  return (
    <div className={`h-full rounded-md flex flex-col ${isDarkTheme ? 'bg-main-dark text-white' : ''}`}>
      {/* 헤더 */}
      <header className={`p-2 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className="flex justify-between items-center p-4 w-full">
          <Skeleton width="w-8" height="h-8" />
          <CircleX className='size-8 opacity-50' />
        </div>
      </header>

      {/* 바디 */}
      <main className={`p-2 overflow-y-auto flex flex-col gap-4 flex-1 ${isDarkTheme ? 'shadow-main-shadow' : ''}`}>
        <div className="p-4 space-y-6">
          {/* 카페 이미지 스켈레톤 */}
          <div className="pb-2 flex flex-col gap-4 shadow-sm shadow-main/10 rounded-md">
            <section className="relative flex flex-col items-center">
              <Skeleton width="w-[20rem]" height="h-60" />
            </section>
          </div>

          {/* 카페 정보 스켈레톤 */}
          <div className="space-y-4">
            {/* 카페 이름 */}
            <Skeleton width="w-48" height="h-8" />

            {/* 주소 */}
            <div className="grid grid-cols-3 gap-2">
              <Skeleton width="w-12" height="h-5" />
              <div className="col-span-2">
                <Skeleton width="w-full" height="h-5" />
              </div>
            </div>

            {/* 전화번호 */}
            <div className="grid grid-cols-3 gap-2">
              <Skeleton width="w-16" height="h-5" />
              <div className="col-span-2">
                <Skeleton width="w-32" height="h-5" />
              </div>
            </div>

            {/* 분류 */}
            <div className="grid grid-cols-3 gap-2">
              <Skeleton width="w-12" height="h-5" />
              <div className="col-span-2 flex gap-2">
                <Skeleton width="w-16" height="h-6" />
                <Skeleton width="w-20" height="h-6" />
                <Skeleton width="w-14" height="h-6" />
              </div>
            </div>

            {/* 운영시간 */}
            <div className="grid grid-cols-3 gap-2">
              <Skeleton width="w-16" height="h-5" />
              <div className="col-span-2">
                <Skeleton width="w-40" height="h-5" />
              </div>
            </div>
          </div>

          {/* 액션 버튼들 스켈레톤 */}
          <div className="flex gap-2">
            <Skeleton width="flex-1" height="h-10" />
          </div>
        </div>
      </main>
    </div>
  );
}