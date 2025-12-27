'use client';

import { useUIStore } from '@/stores';

export default function CafeItemSkeleton() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <div className="flex h-full flex-col">
      <ul className="pagination-sidebar-list flex-1 overflow-y-auto">
        {Array.from({ length: 15 }).map((_, index) => (
          <li
            key={index}
            className="h-24 animate-pulse list-none rounded-sm p-2 shadow-md"
          >
            <div className="flex size-full items-center justify-between">
              <div className="flex h-full flex-col justify-center gap-1">
                <div className="h-6 w-3/4 rounded bg-gray-200" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <footer
        className={`w-full flex-shrink-0 py-4 ${isDarkTheme ? 'bg-dark-background' : 'bg-sidebar-background'} font-dunggeunmo`}
      >
        <div className="flex items-center justify-between">
          <button type="button" className="px-4 py-2">
            <span className="text-3xl">{'<'}</span>
          </button>
          <p className="text-2xl">1 / -</p>
          <button type="button" className="px-4 py-2">
            <span className="text-3xl">{'>'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
