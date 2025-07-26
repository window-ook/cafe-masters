'use client';

import { useState } from 'react';
import { useMapStore, useUIStore } from '@/stores';
import { usePathname } from 'next/navigation';
import CafeDetail from '@/components/shared/sliding-drawer/CafeDetail';
import CollectedCafeDetail from '@/components/shared/sliding-drawer/CollectedCafeDetail';
import BookmarkedCafeDetail from '@/components/shared/sliding-drawer/BookmarkedCafeDetail';
import RecommendedCafeDetail from '@/components/shared/sliding-drawer/RecommendedCafeDetail';
import FormForCollect from '@/components/shared/sliding-drawer/FormForCollect';

export default function SlidingDrawer() {
    const pathname = usePathname();

    const { isSlidingDrawerOpen, isDarkTheme, isExtend } = useUIStore();
    const { currentCafeId } = useMapStore();

    const [isCollectFormOpen, setIsCollectFormOpenAction] = useState(false);
    const [isRecommendFormOpen, setIsRecommendFormOpenAction] = useState(false);

    const PATHS = {
        SEARCH: pathname.startsWith('/search/detail/'),
        COLLECTED: pathname.startsWith('/collected/detail/'),
        BOOKMARKED: pathname.startsWith('/bookmarked/detail/'),
        RECOMMENDED: pathname.startsWith('/recommended/detail/'),
        HELP: pathname.startsWith('/help/'),
    };

    const BASE_STYLE = `static left-0 z-10 translate-y-4 w-screen max-w-108 p-2 overflow-y-auto overflow-x-hidden shadow-md ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-white/20 text-black backdrop-blur-lg'} transition-transform duration-300 ease-in-out`;
    const IS_OPENNED = isSlidingDrawerOpen
        ? `${isExtend ? 'translate-y-52 h-[calc(100vh-13rem)]' : 'translate-y-140'} rounded-t-3xl opacity-100 sm:h-[90vh] sm:translate-y-4 sm:translate-x-8 sm:rounded-md`
        : 'hidden sm:block sm:pointer-events-none opacity-0';
    const SLIDING_DRAWER_STYLE = `${BASE_STYLE} ${IS_OPENNED}`;

    if (!isCollectFormOpen && !isRecommendFormOpen) return (
        <div className={SLIDING_DRAWER_STYLE}>
            {PATHS.SEARCH && <CafeDetail cafeId={currentCafeId} setIsCollectedFormOpenAction={setIsCollectFormOpenAction} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
            {PATHS.COLLECTED && <CollectedCafeDetail cafeId={currentCafeId} setIsCollectedFormOpenAction={setIsCollectFormOpenAction} />}
            {PATHS.BOOKMARKED && <BookmarkedCafeDetail cafeId={currentCafeId} setIsCollectedFormOpenAction={setIsCollectFormOpenAction} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
            {PATHS.RECOMMENDED && <RecommendedCafeDetail cafeId={currentCafeId} setIsCollectedFormOpenAction={setIsCollectFormOpenAction} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
        </div>
    );

    return (
        <FormForCollect />
    );
}