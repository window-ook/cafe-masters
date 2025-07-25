'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from 'stores';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import HelpCenter from '@/components/shared/sidebar/HelpCenter';
import Header from '@/components/shared/sidebar/Header';
import SearchedCafes from '@/components/shared/sidebar/SearchedCafes';
import BookmarkedCafes from '@/components/shared/sidebar/BookmarkedCafes';
import RecommendedSidebarContent from '@/components/shared/sidebar/RecommendedSidebarContent';
import CollectedCafes from '@/components/shared/sidebar/CollectedCafes';
import SlidingDrawer from '../sliding-drawer/SlidingDrawer';

export default function Sidebar() {
  const { isDarkTheme, isSubSidebarOpen, setIsSubSidebarOpen } = useUIStore();
  const pathname = usePathname();

  const PATHS = {
    MAIN: pathname === '/main',
    SEARCH: pathname.startsWith('/search'),
    COLLECTED: pathname.startsWith('/collected'),
    BOOKMARKED: pathname.startsWith('/bookmarked'),
    RECOMMENDED: pathname.startsWith('/recommended'),
    HELP: pathname.startsWith('/help'),
  };

  useEffect(() => {
    if (PATHS.MAIN) setIsSubSidebarOpen(false);
  }, [pathname, PATHS.MAIN, setIsSubSidebarOpen]);


  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <nav className="relative flex recommended-center">
      {/* 사이드바 컨테이너 */}
      <div
        className={`z-10 relative w-screen h-screen max-w-108 px-1 rounded-none shadow-xl shadow-main-shadow ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'
          } ${isSubSidebarOpen && 'hidden sm:block'}`}
      >
        {/* 사이드바 컨텐츠 */}
        <div className="h-full flex flex-col">
          <header className="flex-none">
            <Header />
          </header>

          {PATHS.MAIN && (
            <>
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <TabsForLink />
              </main>
              <footer className="flex-none">
                <Footer />
              </footer>
            </>
          )}

          {PATHS.SEARCH && <SearchedCafes searchResult={[]} />}
          {PATHS.COLLECTED && <CollectedCafes />}
          {PATHS.BOOKMARKED && <BookmarkedCafes />}
          {PATHS.RECOMMENDED && <RecommendedSidebarContent />}
          {PATHS.HELP && <HelpCenter />}
        </div>
      </div>

      {/* 슬라이딩 드로어: 상세 정보 표시 */}
      <SlidingDrawer />
    </nav>
  );
}
