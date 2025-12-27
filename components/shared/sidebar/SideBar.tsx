'use client';

import { useUIStore, useUserStore } from 'stores';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import dynamic from 'next/dynamic';
import Header from '@/components/shared/sidebar/Header';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import SlidingDrawer from '@/components/shared/sliding-drawer/SlidingDrawer';
import CafeItemSkeleton from '@/components/shared/sidebar/CafeItemSkeleton';
import CollectionCafesSkeleton from '@/components/collection/CollectionCafesSkeleton';

const CollectionCafes = dynamic(
  () => import('@/components/collection/CollectionCafes'),
  { ssr: false, loading: () => <CollectionCafesSkeleton /> },
);
const SearchCafes = dynamic(() => import('@/components/search/SearchCafes'), {
  ssr: false,
  loading: () => <CafeItemSkeleton />,
});
const BookmarkCafes = dynamic(
  () => import('@/components/bookmark/BookmarkCafes'),
  { ssr: false, loading: () => <CafeItemSkeleton /> },
);
const RecommendationCafes = dynamic(
  () => import('@/components/recommendation/RecommendationCafes'),
  { ssr: false, loading: () => <CafeItemSkeleton /> },
);

export default function SideBar() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
  const session = useUserStore(state => state.session);

  const paths = usePathMatcher();

  return (
    <aside className="flex">
      <div
        className={`relative z-10 h-screen w-screen bg-transparent ${isDarkTheme ? 'border-gray-700/20 text-white' : 'border-white/30 text-gray-900'} transition-all duration-300 ease-in-out ${isSlidingDrawerOpen && 'hidden sm:block'} sm:max-w-92`}
      >
        <section className="flex h-full flex-col">
          <Header />

          {paths.isMain && (
            <>
              <TabsForLink />
              <Footer />
            </>
          )}

          {paths.isSearch && (
            <div className="min-h-0 flex-1">
              <SearchCafes />
            </div>
          )}

          {paths.isRecommendation && (
            <div className="min-h-0 flex-1">
              <RecommendationCafes />
            </div>
          )}

          {paths.isCollection && (
            <div className="min-h-0 flex-1 sm:hidden">
              <CollectionCafes />
            </div>
          )}

          {paths.isCollection && !session && <Footer />}

          {paths.isBookmark && (
            <>
              <div className="min-h-0 flex-1">
                <BookmarkCafes />
              </div>
              {!session && <Footer />}
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
