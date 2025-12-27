'use client';

import { useUIStore } from '@/stores';

export default function ListSkeleton() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const skeletonItems = Array.from({ length: 15 }, (_, index) => index);

  return (
    <div className="flex h-full flex-col">
      <section className="flex-1 overflow-x-hidden overflow-y-auto">
        <ul className="pagination-sidebar-list">
          {skeletonItems.map(index => (
            <li
              key={index}
              className={`${
                isDarkTheme ? 'shadow-main-shadow bg-gray-800' : 'bg-gray-50'
              } h-24 animate-pulse list-none rounded-sm p-2 shadow-md`}
            >
              <div className="flex h-full w-full items-center justify-between">
                {/* 텍스트 영역 스켈레톤 */}
                <div className="flex h-full flex-1 flex-col justify-center gap-1">
                  {/* 카페명 스켈레톤 */}
                  <div
                    className={`h-6 w-3/4 rounded ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'}`}
                  />
                  {/* 주소 스켈레톤 */}
                  <div
                    className={`h-4 w-5/6 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`}
                  />
                  {/* 전화번호 스켈레톤 */}
                  <div
                    className={`h-4 w-2/3 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`}
                  />
                </div>

                {/* 이미지 영역 스켈레톤 */}
                <div className="ml-2 flex h-full items-center justify-center">
                  <div
                    className={`h-16 w-24 rounded-lg ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'}`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
