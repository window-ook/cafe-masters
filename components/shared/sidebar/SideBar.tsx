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

export default function SideBar() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);

  const paths = usePathMatcher();

  return (
    <nav className="relative flex">
      {/* 사이드바 컨테이너 */}
      <div
        className={`z-10 relative w-screen h-screen max-w-108 px-1 rounded-none shadow-xl shadow-main-shadow 
          ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'} 
          ${isSlidingDrawerOpen && 'hidden sm:block'}`}
      >
        {/* 사이드바 컨텐츠 */}
        <section className="h-full flex flex-col">
          <Header />

          {paths.isMain && (
            <>
              <TabsForLink />
              <Footer />
            </>
          )}

          {paths.isSearch && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <SearchedCafes />
              </Suspense>
            </main>
          )}

          {paths.isCollection && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <CollectionCafes />
              </Suspense>
            </main>
          )}

          {paths.isBookmark && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <BookmarkCafes />
              </Suspense>
            </main>
          )}

          {paths.isRecommendation && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<ListSkeleton />}>
                <RecommendationCafes />
              </Suspense>
            </main>
          )}

          {paths.isHelp && (
            <main className="flex-1 min-h-0">
              <HelpCenter />
            </main>
          )}
        </section>
      </div>

      {/* 슬라이딩 드로어: 상세 정보 표시 */}
      {isSlidingDrawerOpen && (
        <ErrorBoundaryWrapper
          featureName="상세 정보"
          message="상세 정보를 불러오는 중 에러가 발생했습니다."
        >
          <SlidingDrawer />
        </ErrorBoundaryWrapper>
      )}
    </nav>
  );
}
