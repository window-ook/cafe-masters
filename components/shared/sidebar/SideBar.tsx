'use client';

import { Suspense } from 'react';
import { useUIStore } from 'stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import HelpCenter from '@/components/shared/sidebar/HelpCenter';
import Header from '@/components/shared/sidebar/Header';
import SearchedCafes from '@/components/search/SearchCafes';
import BookmarkCafes from '@/components/bookmark/BookmarkCafes';
import RecommendationCafes from '@/components/recommendation/RecommendationCafes';
import CollectionCafes from '@/components/collection/CollectionCafes';
import SlidingDrawer from '@/components/shared/sliding-drawer/SlidingDrawer';
import ListSkeleton from '@/components/shared/sidebar/ListSkeleton';

/** 네비게이션 기능과 목록 표시 기능을 포함하는 Shell */
export default function SideBar() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);

  const paths = usePathMatcher();

  return (
    <nav className="flex">
      <div
        className={`z-10 relative w-screen h-screen max-w-108 px-1 rounded-none border-r-1 border-main-400/20
          ${isDarkTheme ? 'bg-dark-background text-dark-text' : 'bg-sidebar-background'} 
          ${isSlidingDrawerOpen && 'hidden sm:block'}`}
      >
        <section className="h-full flex flex-col">
          <Header />

          {paths.isMain && (
            <>
              <TabsForLink />
              <Footer />
            </>
          )}

          {paths.isSearch && (
            <div className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <SearchedCafes />
              </Suspense>
            </div>
          )}

          {paths.isCollection && (
            <div className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <CollectionCafes />
              </Suspense>
            </div>
          )}

          {paths.isBookmark && (
            <div className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <BookmarkCafes />
              </Suspense>
            </div>
          )}

          {paths.isRecommendation && (
            <div className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <RecommendationCafes />
              </Suspense>
            </div>
          )}

          {paths.isHelp && (
            <div className="flex-1 min-h-0">
              <HelpCenter />
            </div>
          )}
        </section>
      </div>

      {/* 슬라이딩 드로어: 상세 정보 */}
      <ErrorBoundaryWrapper
        featureName="상세 정보"
        message="상세 정보를 불러오는 중 에러가 발생했습니다."
      >
        <SlidingDrawer />
      </ErrorBoundaryWrapper>
    </nav>
  );
}