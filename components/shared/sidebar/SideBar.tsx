'use client';

import { useUIStore, useUserStore } from 'stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import dynamic from 'next/dynamic';
import Header from '@/components/shared/sidebar/Header';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import SlidingDrawer from '@/components/shared/sliding-drawer/SlidingDrawer';
import CollectionCafesSkeleton from '@/components/collection/CollectionCafesSkeleton';
import CafeItemSkeleton from '@/components/shared/sidebar/CafeItemSkeleton';

const SearchCafes = dynamic(() => import('@/components/search/SearchCafes'), { ssr: false, loading: () => <CafeItemSkeleton /> });
const CollectionCafes = dynamic(() => import('@/components/collection/CollectionCafes'), { ssr: false, loading: () => <CollectionCafesSkeleton /> });
const BookmarkCafes = dynamic(() => import('@/components/bookmark/BookmarkCafes'), { ssr: false, loading: () => <CafeItemSkeleton /> });
const RecommendationCafes = dynamic(() => import('@/components/recommendation/RecommendationCafes'), { ssr: false, loading: () => <CafeItemSkeleton /> });

export default function SideBar() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
  const userId = useUserStore(state => state.userId);

  const paths = usePathMatcher();

  return (
    <aside className="flex">
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

          {paths.isSearch && (<div className="flex-1 min-h-0"><SearchCafes /></div>)}

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
    </aside>
  );
}