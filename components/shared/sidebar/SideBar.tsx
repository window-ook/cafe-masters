'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore, useMapStore } from 'stores';
import TabsForLink from '@/components/shared/sidebar/TabsForLink';
import Footer from '@/components/shared/sidebar/Footer';
import Help from '@/components/shared/sidebar/HelpCenter';
import Header from '@/components/shared/sidebar/Header';
import SlidingDrawer from '@/components/shared/sliding-drawer/SlidingDrawer';
import SearchSidebarContent from '@/components/cafe/SearchSidebarContent';
import CollectedSidebarContent from '@/components/cafe/CollectedSidebarContent';
import BookmarkedSidebarContent from '@/components/cafe/BookmarkedSidebarContent';
import RecommendedSidebarContent from '@/components/cafe/RecommendedSidebarContent';

export default function Sidebar() {
  const { searchResult } = useMapStore();
  const { isDarkTheme, isSubSidebarOpen, setIsSubSidebarOpen } = useUIStore();
  const pathname = usePathname();

  const isMainPage = pathname === '/main';
  const isSearchResultPage = pathname.startsWith('/search');
  const isCollectedPage = pathname.startsWith('/collected');
  const isBookmarkedPage = pathname.startsWith('/bookmarked');
  const isRecommendedPage = pathname.startsWith('/recommended');
  const isHelpPage = pathname.startsWith('/help');


  useEffect(() => {
    if (isMainPage) setIsSubSidebarOpen(false);
  }, [pathname, isMainPage, setIsSubSidebarOpen]);


  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <nav className="relative flex recommended-center">
      <div
        className={`z-10 relative w-screen h-screen max-w-108 px-1 rounded-none shadow-xl shadow-main-shadow ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'
          } ${isSubSidebarOpen && 'hidden sm:block'}`}
      >
        <div className="h-full flex flex-col">
          {/* 상단 */}
          <header className="flex-none">
            <Header />
          </header>

          {/* 중단: 경로별 컨텐츠 렌더링 */}
          {isMainPage && (
            <>
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <TabsForLink />
              </main>
              <footer className="flex-none">
                <Footer />
              </footer>
            </>
          )}

          {isSearchResultPage && (
            <SearchSidebarContent 
              searchResult={searchResult}
              className="flex-1 flex flex-col overflow-hidden"
            />
          )}

          {isCollectedPage && (
            <CollectedSidebarContent className="flex-1 overflow-y-auto overflow-x-hidden" />
          )}

          {isBookmarkedPage && (
            <BookmarkedSidebarContent className="flex-1 overflow-y-auto overflow-x-hidden" />
          )}

          {isRecommendedPage && (
            <RecommendedSidebarContent className="flex-1 flex flex-col overflow-hidden" />
          )}

          {isHelpPage && (
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <Help />
            </main>
          )}
        </div>
      </div>

      <SlidingDrawer />
    </nav>
  );
}
