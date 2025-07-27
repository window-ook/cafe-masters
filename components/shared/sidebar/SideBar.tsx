'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from 'stores';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import HelpCenter from '@/components/shared/sidebar/HelpCenter';
import Header from '@/components/shared/sidebar/Header';
import SearchedCafes from '@/components/shared/sidebar/SearchedCafes';
import BookmarkedCafes from '@/components/shared/sidebar/BookmarkedCafes';
import RecommendedCafes from '@/components/shared/sidebar/RecommendedCafes';
import CollectedCafes from '@/components/shared/sidebar/CollectedCafes';
import SlidingDrawer from '@/components/shared/sliding-drawer/SlidingDrawer';

export default function Sidebar() {
  const pathname = usePathname();

  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const isSlidingDrawerOpen = useUIStore(state => state.isSlidingDrawerOpen);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

  const PATHS = {
    MAIN: pathname === '/main',
    SEARCH: pathname.startsWith('/search'),
    COLLECTED: pathname.startsWith('/collected'),
    BOOKMARKED: pathname.startsWith('/bookmarked'),
    RECOMMENDED: pathname.startsWith('/recommended'),
    HELP: pathname.startsWith('/help'),
  };

  useEffect(() => { if (PATHS.MAIN) setIsSlidingDrawerOpen(false); }, [pathname, PATHS.MAIN, setIsSlidingDrawerOpen]);

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

          {PATHS.MAIN && (
            <>
              <TabsForLink />
              <Footer />
            </>
          )}

          {PATHS.SEARCH && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<div>Loading...</div>}>
                <SearchedCafes />
              </Suspense>
            </main>
          )}

          {PATHS.COLLECTED && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<div>Loading...</div>}>
                <CollectedCafes />
              </Suspense>
            </main>
          )}

          {PATHS.BOOKMARKED && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<div>Loading...</div>}>
                <BookmarkedCafes />
              </Suspense>
            </main>
          )}

          {PATHS.RECOMMENDED && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<div>Loading...</div>}>
                <RecommendedCafes />
              </Suspense>
            </main>
          )}

          {PATHS.HELP && (
            <main className="flex-1 min-h-0">
              <Suspense fallback={<div>Loading...</div>}>
                <HelpCenter />
              </Suspense>
            </main>
          )}
        </section>
      </div>

      {/* 슬라이딩 드로어: 상세 정보 표시 */}
      {isSlidingDrawerOpen && <SlidingDrawer />}
    </nav>
  );
}
