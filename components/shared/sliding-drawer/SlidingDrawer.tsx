'use client';

import { useState, Suspense } from 'react';
import { useCurrentCafeStore, useUIStore } from '@/stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { ErrorBoundary } from 'react-error-boundary';
import clsx from 'clsx';
import SearchCafeDetail from '@/components/search/detail/SearchCafeDetail';
import CafeDetailSkeleton from '@/components/shared/sliding-drawer/CafeDetailSkeleton';
import CollectionCafeDetail from '@/components/collection/detail/CollectionCafeDetail';
import BookmarkCafeDetail from '@/components/bookmark/detail/BookmarkCafeDetail';
import RecommendationCafeDetail from '@/components/recommendation/detail/RecommendationCafeDetail';
import FormForCollect from '@/components/shared/sliding-drawer/FormForCollect';
import FormForRecommend from '@/components/shared/sliding-drawer/FormForRecommend';
import DetailErrorFallback from '@/components/shared/sliding-drawer/DetailErrorFallback';

/** 각 도메인별 상세 정보 페이지를 표시하는 슬라이딩 드로어
 * @renderContent 수집하기 폼, 추천하기 폼, 각 도메인별 카페 상세 정보
 */
export default function SlidingDrawer() {
    const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
    const isDarkTheme = useUIStore(state => state.isDarkTheme);
    const isExtend = useUIStore(state => state.isExtend);
    const currentCafeId = useCurrentCafeStore(state => state.currentCafeId);
    const isCollectFormOpen = useUIStore(state => state.isCollectFormOpen);

    const [isRecommendFormOpen, setIsRecommendFormOpenAction] = useState(false);

    const paths = usePathMatcher();

    const SLIDING_DRAWER_STYLE = clsx(
        'static left-0 z-10 translate-y-4 w-screen max-w-108 p-2 overflow-x-hidden overflow-y-auto shadow-md transition-transform duration-300 ease-in-out',
        isDarkTheme ? 'bg-main-dark text-white' : 'bg-white/20 text-black backdrop-blur-lg',
        {
            'hidden sm:block sm:pointer-events-none opacity-0': !isSlidingDrawerOpen,
            'rounded-t-3xl opacity-100 sm:h-[90vh] sm:translate-y-4 sm:translate-x-8 sm:rounded-md': isSlidingDrawerOpen,
            'translate-y-52 h-[calc(100vh-13rem)]': isSlidingDrawerOpen && isExtend,
            'translate-y-140': isSlidingDrawerOpen && !isExtend,
        }
    );

    const renderContent = () => {
        if (isCollectFormOpen) {
            return <FormForCollect />;
        }
        if (isRecommendFormOpen) {
            return <FormForRecommend setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />;
        }

        return (
            <ErrorBoundary fallback={<DetailErrorFallback />}>
                <Suspense fallback={<CafeDetailSkeleton />}>
                    {paths.isSearchDetail && <SearchCafeDetail cafeId={currentCafeId} setIsRecommendFormOpenAction={setIsRecommendFormOpenAction} />}
                    {paths.isCollectedDetail && <CollectionCafeDetail cafeId={currentCafeId} />}
                    {paths.isBookmarkedDetail && <BookmarkCafeDetail cafeId={currentCafeId} />}
                    {paths.isRecommendedDetail && <RecommendationCafeDetail cafeId={currentCafeId} />}
                </Suspense>
            </ErrorBoundary>
        );
    };

    return (
        <div className={SLIDING_DRAWER_STYLE}>
            {renderContent()}
        </div>
    );
}