'use client';

import { ReactNode } from 'react';
import { copyText } from '@/utils/shared/detail';
import { FolderCheck, Send } from 'lucide-react';
import Tooltip from '@/components/shared/Tooltip';
import Location from '@/components/shared/sliding-drawer/Location';
import KakaoMapLink from '@/components/shared/sliding-drawer/KakaoMapLink';
import Categories from '@/components/shared/sliding-drawer/Categories';

interface ICafeDetailBody {
  /** 카카오 장소 ID. 검색·북마크·추천은 행 ID가 곧 장소 ID입니다 */
  cafeId: number;
  cafeData: {
    name: string;
    address: string;
    categories?: string[];
    kakaoCategories?: string[];
  };
  actionButtons: ReactNode;
}

export default function CafeDetailBody({
  cafeId,
  cafeData,
  actionButtons,
}: ICafeDetailBody) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/search/detail/${cafeId}?name=${encodeURIComponent(cafeData.name)}`;

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4">
      {/* 카페 정보 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          {/* 카페 이름 */}
          <h1 className="text-2xl font-bold">{cafeData.name}</h1>
          {/* 공유 버튼 */}
          <Tooltip
            comment="공유"
            component={
              <button
                type="button"
                aria-label="카페 url 공유 버튼"
                onClick={() => copyText(url)}
                className="cursor-pointer p-2 hover:opacity-50"
              >
                <Send className="size-4" />
              </button>
            }
          />
        </div>

        {/* 카테고리 (수집, 추천 카페) */}
        {cafeData.categories && cafeData.categories.length > 0 && (
          <Categories categories={cafeData.categories} />
        )}

        {/* 주소 */}
        <Location address={cafeData.address} />

        {/* 사진·메뉴·영업시간은 카카오맵에서 봅니다 */}
        <KakaoMapLink placeId={cafeId} />

        {/* 카카오맵 분류 (검색 결과) */}
        {cafeData.kakaoCategories && cafeData.kakaoCategories.length > 0 && (
          <div className="col-span-2 grid grid-cols-3">
            <div className="flex items-center gap-2">
              <FolderCheck className="size-4" />
              <p className="col-span-1 font-medium">분류</p>
            </div>
            <div className="col-span-2 flex flex-wrap gap-2">
              {cafeData.kakaoCategories.map((category, index) => (
                <span
                  key={index}
                  className="rounded-full px-2 py-1 text-xs shadow-md"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 수집, 추천 버튼 */}
      <section className="flex gap-2">{actionButtons}</section>
    </main>
  );
}
