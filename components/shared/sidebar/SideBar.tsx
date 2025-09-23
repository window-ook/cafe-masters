'use client';

import { useUIStore, useUserStore } from 'stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import Header from '@/components/shared/sidebar/Header';
import SearchedCafes from '@/components/search/SearchCafes';
import BookmarkCafes from '@/components/bookmark/BookmarkCafes';
import RecommendationCafes from '@/components/recommendation/RecommendationCafes';
import CollectionCafes from '@/components/collection/CollectionCafes';
import SlidingDrawer from '@/components/shared/sliding-drawer/SlidingDrawer';

/** 네비게이션, 리스트 표시 Shell Container */
export default function SideBar() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
  const userId = useUserStore(state => state.userId);

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

          {paths.isSearch && (<div className="flex-1 min-h-0"><SearchedCafes /></div>)}

          {paths.isRecommendation && (<div className="flex-1 min-h-0"><RecommendationCafes /></div>)}

          {paths.isCollection && (
            <>
              <div className="flex-1 min-h-0">
                <CollectionCafes />
              </div>
              {!userId && <Footer />}
            </>
          )}

          {paths.isBookmark && (
            <>
              <div className="flex-1 min-h-0">
                <BookmarkCafes />
              </div>
              {!userId && <Footer />}
            </>
          )}
        </section>
      </div>

      <ErrorBoundaryWrapper
        featureName="상세 정보"
        message="상세 정보를 불러오는 중 에러가 발생했습니다."
      >
        <SlidingDrawer />
      </ErrorBoundaryWrapper>
    </nav>
  );
}