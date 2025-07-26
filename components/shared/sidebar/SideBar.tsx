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

  const { isDarkTheme, isSlidingDrawerOpen, setIsSlidingDrawerOpen } = useUIStore();

  const PATHS = {
    MAIN: pathname === '/main',
    SEARCH: pathname.startsWith('/search'),
    COLLECTED: pathname.startsWith('/collected'),
    BOOKMARKED: pathname.startsWith('/bookmarked'),
    RECOMMENDED: pathname.startsWith('/recommended'),
    HELP: pathname.startsWith('/help'),
  };

  useEffect(() => {
    if (PATHS.MAIN) setIsSlidingDrawerOpen(false);
  }, [pathname, PATHS.MAIN, setIsSlidingDrawerOpen]);

  return (
    <nav className="relative flex recommended-center">
      {/* 사이드바 컨테이너 */}
      <div
        className={`z-10 relative w-screen h-screen max-w-108 px-1 rounded-none shadow-xl shadow-main-shadow ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'
          } ${isSlidingDrawerOpen && 'hidden sm:block'}`}
      >
        {/* 사이드바 컨텐츠 */}
        <div className="h-full flex flex-col">
          <header className="flex-none">
            <Header />
          </header>

          {PATHS.MAIN && (
            <>
              <main className="flex-1">
                <TabsForLink />
              </main>
              <footer className="flex-none">
                <Footer />
              </footer>
            </>
          )}
          <Suspense fallback={<div>Loading...</div>}>
            {PATHS.SEARCH && <SearchedCafes />}
            {PATHS.COLLECTED && <CollectedCafes />}
            {PATHS.BOOKMARKED && <BookmarkedCafes />}
            {PATHS.RECOMMENDED && <RecommendedCafes />}
            {PATHS.HELP && <HelpCenter />}
          </Suspense>
        </div>
      </div>

      {/* 슬라이딩 드로어: 상세 정보 표시 */}
      {isSlidingDrawerOpen && <SlidingDrawer />}
    </nav>
  );
}
