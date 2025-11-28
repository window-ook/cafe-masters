'use client';

import { useUIStore } from '@/stores';

export default function CafeItemSkeleton() {
    const isDarkTheme = useUIStore(state => state.isDarkTheme);

    return (
        <div className='h-full flex flex-col'>
            <ul className="pagination-sidebar-list flex-1 overflow-y-auto">
                {Array.from({ length: 15 }).map((_, index) => (
                    <li
                        key={index}
                        className="h-24 p-2 rounded-sm shadow-md list-none animate-pulse"
                    >
                        <div className="size-full flex justify-between items-center">
                            <div className="h-full flex flex-col justify-center gap-1">
                                <div className="h-6 w-3/4 rounded bg-gray-200" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <footer className={`w-full py-4 flex-shrink-0 ${isDarkTheme ? 'bg-dark-background' : 'bg-sidebar-background'} font-dunggeunmo`}>
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        className="px-4 py-2"
                    >
                        <span className="text-3xl ">{'<'}</span>
                    </button>
                    <p className="text-2xl ">
                        1 / -
                    </p>
                    <button
                        type="button"
                        className="px-4 py-2"
                    >
                        <span className="text-3xl ">{'>'}</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
