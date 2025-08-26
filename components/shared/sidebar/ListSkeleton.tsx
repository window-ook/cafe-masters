'use client';

import { useUIStore } from '@/stores';

export default function ListSkeleton() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const skeletonItems = Array.from({ length: 15 }, (_, index) => index);

  return (
    <div className="h-full flex flex-col">
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="pagination-sidebar-list">
          {skeletonItems.map((index) => (
            <li
              key={index}
              className={`${isDarkTheme
                ? 'bg-main-dark shadow-main-shadow'
                : 'bg-gray-50'} h-24 p-2 rounded-sm shadow-md list-none animate-pulse`}
            >
              <div className="w-full h-full flex justify-between items-center">
                {/* 텍스트 영역 스켈레톤 */}
                <div className="h-full flex flex-col justify-center gap-1 flex-1">
                  {/* 카페명 스켈레톤 */}
                  <div className={`h-6 w-3/4 rounded ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'}`} />
                  {/* 주소 스켈레톤 */}
                  <div className={`h-4 w-5/6 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`} />
                  {/* 전화번호 스켈레톤 */}
                  <div className={`h-4 w-2/3 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`} />
                </div>

                {/* 이미지 영역 스켈레톤 */}
                <div className="h-full flex items-center justify-center ml-2">
                  <div className={`w-24 h-16 rounded-lg ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-200'}`} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

