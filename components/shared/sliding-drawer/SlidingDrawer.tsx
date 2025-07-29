'use client';

import { useState, Suspense } from 'react';
import { useMapStore, useUIStore } from '@/stores';
import { usePathname } from 'next/navigation';
import SearchedCafeDetail from '@/components/shared/sliding-drawer/SearchedCafeDetail';
import CafeDetailSkeleton from '@/components/shared/sliding-drawer/CafeDetailSkeleton';
import CollectedCafeDetail from '@/components/shared/sliding-drawer/CollectedCafeDetail';
import BookmarkedCafeDetail from '@/components/shared/sliding-drawer/BookmarkedCafeDetail';
import RecommendedCafeDetail from '@/components/shared/sliding-drawer/RecommendedCafeDetail';
import FormForCollect from '@/components/shared/sliding-drawer/FormForCollect';
import FormForRecommend from '@/components/shared/sliding-drawer/FormForRecommend';

/** 각 도메인별 상세 정보 페이지를 표시하는 슬라이딩 드로어 */
export default function SlidingDrawer() {
    const pathname = usePathname();

    const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
    const isDarkTheme = useUIStore(state => state.isDarkTheme);
    const isExtend = useUIStore(state => state.isExtend);
    const currentCafeId = useMapStore(state => state.currentCafeId);
    const isCollectFormOpen = useUIStore(state => state.isCollectFormOpen);

    const [isRecommendFormOpen, setIsRecommendFormOpenAction] = useState(false);

    const PATHS = {
        SEARCH: pathname.startsWith('/search/detail/'),
        COLLECTED: pathname.startsWith('/collected/detail/'),
        BOOKMARKED: pathname.startsWith('/bookmarked/detail/'),
        RECOMMENDED: pathname.startsWith('/recommended/detail/'),
        HELP: pathname.startsWith('/help/'),
    };

    const BASE_STYLE = `static left-0 z-10 translate-y-4 w-screen max-w-108 p-2 overflow-x-hidden overflow-y-auto shadow-md ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-white/20 text-black backdrop-blur-lg'} transition-transform duration-300 ease-in-out`;
    const IS_OPENNED = isSlidingDrawerOpen
        ? `${isExtend ? 'translate-y-52 h-[calc(100vh-13rem)]' : 'translate-y-140'} rounded-t-3xl opacity-100 sm:h-[90vh] sm:translate-y-4 sm:translate-x-8 sm:rounded-md`
        : 'hidden sm:block sm:pointer-events-none opacity-0';
    const SLIDING_DRAWER_STYLE = `${BASE_STYLE} ${IS_OPENNED}`;

    if (!isCollectFormOpen && !isRecommendFormOpen) return (
        <div className={SLIDING_DRAWER_STYLE}>
            <Suspense fallback={<CafeDetailSkeleton />}>
                {PATHS.SEARCH && <SearchedCafeDetail cafeId={currentCafeId} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
                {PATHS.COLLECTED && <CollectedCafeDetail cafeId={currentCafeId} />}
                {PATHS.BOOKMARKED && <BookmarkedCafeDetail cafeId={currentCafeId} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
                {PATHS.RECOMMENDED && <RecommendedCafeDetail cafeId={currentCafeId} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
            </Suspense>
        </div>
    );

    if (isCollectFormOpen) return (
        <div className={SLIDING_DRAWER_STYLE}>
            <FormForCollect />
        </div>
    );

    if (isRecommendFormOpen) return (
        <div className={SLIDING_DRAWER_STYLE}>
            <FormForRecommend
                setIsRecommendFormOpenAction={setIsRecommendFormOpenAction}
            />
        </div>
    );
}