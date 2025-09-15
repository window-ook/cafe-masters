'use client';

import { useState } from 'react';
import { useCurrentCafeStore, useUIStore } from '@/stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import clsx from 'clsx';
import SearchCafeDetail from '@/components/search/detail/SearchCafeDetail';
import CollectionCafeDetail from '@/components/collection/detail/CollectionCafeDetail';
import BookmarkCafeDetail from '@/components/bookmark/detail/BookmarkCafeDetail';
import RecommendationCafeDetail from '@/components/recommendation/detail/RecommendationCafeDetail';
import FormForCollect from '@/components/shared/sliding-drawer/FormForCollect';
import FormForRecommend from '@/components/shared/sliding-drawer/FormForRecommend';

/** 상세 정보, 수집하기, 추천하기 폼을 표시하는 Shell */
export default function SlidingDrawer() {
    const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
    const isDarkTheme = useUIStore(state => state.isDarkTheme);
    const isExtend = useUIStore(state => state.isExtend);
    const currentCafeId = useCurrentCafeStore(state => state.currentCafeId);
    const isCollectFormOpen = useUIStore(state => state.isCollectFormOpen);
    const closeSlidingDrawer = useUIStore(state => state.closeSlidingDrawer);

    const [isRecommendFormOpen, setIsRecommendFormOpenAction] = useState(false);

    const paths = usePathMatcher();

    if (paths.isMain && isSlidingDrawerOpen) closeSlidingDrawer();

    const SLIDING_DRAWER_STYLE = clsx(
        'fixed z-10 w-screen max-w-108 p-2 overflow-x-hidden overflow-y-auto shadow-md transition-all duration-300 ease-in-out',
        // 다크 모드
        isDarkTheme ? 'bg-dark-background text-white' : 'bg-white/20 text-black backdrop-blur-lg',
        {
            // 모바일 닫힌 상태: 화면 아래로 숨김
            'rounded-t-3xl bottom-0 left-0 h-[40vh] translate-y-full opacity-0 pointer-events-none': !isSlidingDrawerOpen && !isExtend,
            'rounded-t-3xl bottom-0 left-0 h-[calc(100vh-3rem)] translate-y-full opacity-0 pointer-events-none': !isSlidingDrawerOpen && isExtend,

            // 모바일 열린 상태: 아래에서 위로 슬라이드
            'rounded-t-3xl bottom-0 left-0 h-[40vh] translate-y-0 opacity-100': isSlidingDrawerOpen && !isExtend,
            'rounded-t-3xl bottom-0 left-0 h-[calc(100vh-3rem)] translate-y-0 opacity-100': isSlidingDrawerOpen && isExtend,

            // 데스크톱 닫힌 상태: 사이드바 우측 영역에서 오른쪽으로 숨김
            'sm:top-4 sm:left-[27rem] sm:h-[90vh] sm:rounded-md sm:bottom-auto sm:translate-y-0 sm:translate-x-0 sm:opacity-0 sm:pointer-events-none': !isSlidingDrawerOpen,

            // 데스크톱 열린 상태: 사이드바 우측에서 12만큼 왼쪽으로 이동
            'sm:top-4 sm:left-[27rem] sm:h-[90vh] sm:rounded-md sm:bottom-auto sm:translate-y-0 sm:translate-x-12 sm:opacity-100': isSlidingDrawerOpen,
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

    return <div role="dialog" aria-modal="true" className={SLIDING_DRAWER_STYLE}>{renderContent()}</div>;
}