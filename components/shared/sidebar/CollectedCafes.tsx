'use client';

import React, { useEffect } from 'react';
import { useUserStore } from 'stores';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useInView } from 'react-intersection-observer';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { useCafeClickHandler } from '@/hooks/ui/useCafeClickHandler';
import CollectedCafe from '@/components/shared/sidebar/CollectedCafe';
import PulseDot from '@/components/shared/sliding-drawer/PulseDot';

export default function CollectedCafes() {
  const { userId } = useUserStore();

  const {
    filteredCollectedCafes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCollectedCafes(userId, true);

  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (collectedInView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [collectedInView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleCollectedCafeClick = useCafeClickHandler<ISupabaseCollectedCafe>({
    routePath: 'collected',
    shouldSetCurrentCafeId: true,
  });

  // 로그인 확인
  if (!userId) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center justify-center h-full py-16 px-8">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">로그인이 필요합니다</p>
            <p className="text-sm">수집한 카페를 확인하려면 로그인해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center justify-center h-full py-16 px-8">
          <div className="text-center text-red-500">
            <p className="text-lg font-medium mb-2">오류가 발생했습니다</p>
            <p className="text-sm">{error?.message || '데이터를 불러올 수 없습니다.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center justify-center h-full py-16">
          <PulseDot />
          <p className="text-center text-gray-500 mt-4">수집한 카페를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 빈 데이터 상태
  if (!filteredCollectedCafes || filteredCollectedCafes.length === 0) {
    return (
      <div className="relative overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center justify-center h-full py-16 px-8">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">수집한 카페가 없습니다</p>
            <p className="text-sm">카페를 방문하여 수집해보세요!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="pagination-sidebar-list">
          {filteredCollectedCafes.map((cafe: ISupabaseCollectedCafe) => (
            <CollectedCafe
              key={cafe.id}
              name={cafe.name}
              ratings={cafe.ratings!}
              photoUrl={cafe.image}
              address={cafe.address}
              phoneNum={cafe.phone_number!}
              onClickAction={() => handleCollectedCafeClick(cafe)}
            />
          ))}
        </ul>
        {isFetchingNextPage && <PulseDot />}
        <div ref={collectedRef} className="h-8 w-full bg-transparent"></div>
      </section>
    </div>
  );
}