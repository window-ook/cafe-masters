'use client';

import { useState, useEffect } from 'react';
import { useCurrentCafeStore, useUIStore } from '@/stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import SlidingDrawerFallback from '@/components/shared/sliding-drawer/SlidingDrawerFallback';

const SearchCafeDetail = dynamic(() => import('@/components/search/detail/SearchCafeDetail'), {
    loading: () => <SlidingDrawerFallback />,
    ssr: false,
});

const CollectionCafeDetail = dynamic(() => import('@/components/collection/detail/CollectionCafeDetail'), {
    loading: () => <SlidingDrawerFallback />,
    ssr: false,
});

const BookmarkCafeDetail = dynamic(() => import('@/components/bookmark/detail/BookmarkCafeDetail'), {
    loading: () => <SlidingDrawerFallback />,
    ssr: false,
});

const RecommendationCafeDetail = dynamic(() => import('@/components/recommendation/detail/RecommendationCafeDetail'), {
    loading: () => <SlidingDrawerFallback />,
    ssr: false,
});

const FormForCollect = dynamic(() => import('@/components/shared/sliding-drawer/FormForCollect'), {
    loading: () => <SlidingDrawerFallback />,
    ssr: false,
});

const FormForRecommend = dynamic(() => import('@/components/shared/sliding-drawer/FormForRecommend'), {
    loading: () => <SlidingDrawerFallback />,
    ssr: false,
});

export default function SlidingDrawer() {
    const currentCafeId = useCurrentCafeStore(state => state.currentCafeId);
    const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
    const isDarkTheme = useUIStore(state => state.isDarkTheme);
    const isExtend = useUIStore(state => state.isExtend);
    const isCollectFormOpen = useUIStore(state => state.isCollectFormOpen);
    const closeSlidingDrawer = useUIStore(state => state.closeSlidingDrawer);

    const [isRecommendFormOpen, setIsRecommendFormOpenAction] = useState(false);

    const paths = usePathMatcher();

    useEffect(() => { if (paths.isMain && isSlidingDrawerOpen) closeSlidingDrawer(); }, [paths.isMain, isSlidingDrawerOpen, closeSlidingDrawer]);

    const SLIDING_DRAWER_STYLE = clsx(
        'fixed z-10 w-screen max-w-108 p-2 overflow-x-hidden overflow-y-auto shadow-md transition-all duration-300 ease-in-out',
        isDarkTheme ? 'bg-dark-background/50 backdrop-blur-sm text-white' : 'bg-white/20 text-black backdrop-blur-lg',
        {
            // 모바일 닫힌 상태
            'rounded-t-3xl bottom-0 left-0 h-[30vh] translate-y-full opacity-0 pointer-events-none': !isSlidingDrawerOpen && !isExtend,
            'rounded-t-3xl bottom-0 left-0 h-[70vh] translate-y-full opacity-0 pointer-events-none': !isSlidingDrawerOpen && isExtend,

            // 모바일 열린 상태
            'rounded-t-3xl bottom-0 left-0 h-[30vh] translate-y-0 opacity-100': isSlidingDrawerOpen && !isExtend,
            'rounded-t-3xl bottom-0 left-0 h-[70vh] translate-y-0 opacity-100': isSlidingDrawerOpen && isExtend,

            // 데스크톱 닫힌 상태
            'sm:top-4 sm:left-[27rem] sm:h-[80vh] sm:rounded-3xl sm:bottom-auto sm:translate-y-24 sm:translate-x-0 sm:opacity-0 sm:pointer-events-none': !isSlidingDrawerOpen,

            // 데스크톱 열린 상태
            'sm:top-4 sm:left-[27rem] sm:h-[80vh] sm:rounded-3xl sm:bottom-auto sm:translate-y-24 sm:translate-x-8 sm:opacity-100': isSlidingDrawerOpen,
        }
    );

    const renderContent = () => {
        if (isCollectFormOpen) return <FormForCollect />;
        if (isRecommendFormOpen) return <FormForRecommend setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />;

        return (
            <>
                {paths.isSearchDetail && <SearchCafeDetail cafeId={currentCafeId} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
                {paths.isCollectionDetail && <CollectionCafeDetail cafeId={currentCafeId} />}
                {paths.isBookmarkDetail && <BookmarkCafeDetail cafeId={currentCafeId} />}
                {paths.isRecommendationDetail && <RecommendationCafeDetail cafeId={currentCafeId} />}
            </>
        );
    };

    return <div data-testid="sliding-drawer" className={SLIDING_DRAWER_STYLE}>{renderContent()}</div>;
}