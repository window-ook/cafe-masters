'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import {
  SearchResult,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
} from 'types/common';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import Header from './header';
import Footer from './footer';
import SidebarTabList from './main/sidebar-tab-list';

import useCollectedInfiniteQuery from 'hooks/cache/useCollectedInfiniteQuery';
import useBookmarkedInfiniteQuery from 'hooks/cache/useBookmarkedInfiniteQuery';
import CircularProgress from './shared/circular-progress';

const NormalCafe = dynamic(() => import('./main/normal-cafe'), { ssr: false });

const CollectedCafe = dynamic(() => import('./main/collected-cafe'), {
  ssr: false,
});

const PageConverter = dynamic(() => import('./footer/page-converter'), {
  ssr: false,
});

const SubSidebar = dynamic(() => import('./sub-sidebar'), { ssr: false });

export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.5,
  });
  const { ref: bookmarkedRef, inView: bookmarkedInView } = useInView({
    threshold: 0.5,
  });

  const searchResult = useMapStore(state => state.searchResult);
  const setThisX = useMapStore(state => state.setThisX);
  const setThisY = useMapStore(state => state.setThisY);
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const isSubSidebarOpen = useCheckStore(state => state.isSubSidebarOpen);
  const setIsSubSidebarOpen = useCheckStore(state => state.setIsSubSidebarOpen);
  const setIsMenuOpen = useCheckStore(state => state.setIsMenuOpen);
  const collectedSearchTerm = useMapStore(state => state.collectedSearchTerm);
  const bookmarkedSearchTerm = useMapStore(state => state.bookmarkedSearchTerm);

  const router = useRouter();

  const pathname = usePathname();

  const isMainPage = pathname === '/cafe';
  const isSearchResultPage = pathname.startsWith('/cafe/search');
  const isCollectedPage = pathname.startsWith('/cafe/collected');
  const isBookmarkedPage = pathname.startsWith('/cafe/bookmarked');

  const itemsPerPage = 15;
  const totalPages = Math.ceil(searchResult.length / itemsPerPage);

  const paginatedResults = searchResult.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const cardDivStyle = 'flex flex-col gap-8 my-8 px-8';

  const {
    fetchedCollectedCafe,
    fetchNextPage: fetchNextCollectedPage,
    hasNextPage: hasNextCollectedPage,
    isFetchingNextPage: isFetchingNextCollectedPage,
  } = useCollectedInfiniteQuery(userId, isCollectedPage);

  const {
    fetchedBookmarkedCafe,
    fetchNextPage: fetchNextBookmarkedPage,
    hasNextPage: hasNextBookmarkedPage,
    isFetchingNextPage: isFetchingNextBookmarkedPage,
  } = useBookmarkedInfiniteQuery(userId, isBookmarkedPage);

  useEffect(() => {
    if (
      isCollectedPage &&
      collectedInView &&
      hasNextCollectedPage &&
      !isFetchingNextCollectedPage
    ) {
      fetchNextCollectedPage();
    }
  }, [
    collectedInView,
    hasNextCollectedPage,
    fetchNextCollectedPage,
    isFetchingNextCollectedPage,
    isCollectedPage,
  ]);

  useEffect(() => {
    if (
      isBookmarkedPage &&
      bookmarkedInView &&
      hasNextBookmarkedPage &&
      !isFetchingNextBookmarkedPage
    ) {
      fetchNextBookmarkedPage();
    }
  }, [
    bookmarkedInView,
    hasNextBookmarkedPage,
    fetchNextBookmarkedPage,
    isFetchingNextBookmarkedPage,
    isBookmarkedPage,
  ]);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (isMainPage) setIsSubSidebarOpen(false);
  }, [pathname, isMainPage, setIsSubSidebarOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResult]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNormalCafeClick = (cafe: SearchResult) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/search/detail/${cafe.id}`);
    setThisX(cafe?.x);
    setThisY(cafe?.y);
  };

  const handleCollectedCafeClick = (cafe: CollectedCafeFromSupabase) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/collected/detail/${cafe.id}`);
    setThisX(cafe?.coordX);
    setThisY(cafe?.coordY);
  };

  const handleBookmarkedCafeClick = (cafe: BookmarkedCafeFromSupabase) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/bookmarked/detail/${cafe.id}`);
    setThisX(cafe?.coordX);
    setThisY(cafe?.coordY);
  };

  const filterCollctedBySearchTerm = (
    cafes: CollectedCafeFromSupabase[],
    searchTerm: string,
  ) => {
    if (!searchTerm) return cafes;
    return cafes.filter(cafe =>
      cafe.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const filterBookmarkedBySearchTerm = (
    cafes: BookmarkedCafeFromSupabase[],
    searchTerm: string,
  ) => {
    if (!searchTerm) return cafes;
    return cafes.filter(cafe =>
      cafe.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <nav className="relative flex items-center">
      <div
        className={`z-10 relative w-screen h-screen max-w-[27rem] px-1 rounded-none shadow-xl shadow-main-shadow ${
          isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'
        } ${isSubSidebarOpen ? 'hidden sm:block' : ''}`}
      >
        <div className="h-full flex flex-col">
          {/* 상단 */}
          <header className="flex-none">
            <Header />
          </header>

          {/* 중단 */}
          <main
            className="flex-1 overflow-y-auto overflow-x-hidden"
            ref={containerRef}
          >
            {isMainPage && <SidebarTabList />}

            <section className="px-8 sm:px-4">
              {isSearchResultPage && (
                <div className={cardDivStyle}>
                  {paginatedResults.map((cafe: SearchResult) => (
                    // 검색 리스트 컴포넌트 만들어서 대체하기
                    <NormalCafe
                      key={cafe.id}
                      name={cafe.place_name}
                      address={cafe.address_name}
                      phoneNum={cafe.phone}
                      onClick={() => handleNormalCafeClick(cafe)}
                    />
                  ))}
                </div>
              )}

              {isCollectedPage && (
                <div className="relative">
                  {fetchedCollectedCafe?.pages?.map((page, i) => (
                    <div key={`page-${i}`} className={cardDivStyle}>
                      {filterCollctedBySearchTerm(
                        page.data,
                        collectedSearchTerm,
                      ).map((cafe: CollectedCafeFromSupabase) => (
                        <CollectedCafe
                          key={cafe.id}
                          name={cafe.name}
                          ratings={cafe.rating}
                          photoUrl={cafe.photoUrl}
                          address={cafe.address}
                          phoneNum={cafe.phoneNum}
                          onClick={() => handleCollectedCafeClick(cafe)}
                        />
                      ))}
                    </div>
                  ))}

                  {isFetchingNextCollectedPage && (
                    <div className="fixed bottom-4 left-4">
                      <CircularProgress />
                    </div>
                  )}

                  <div ref={collectedRef} className="h-[2rem] w-[22rem]"></div>
                </div>
              )}

              {isBookmarkedPage && (
                <div className="relative">
                  {fetchedBookmarkedCafe?.pages?.map((page, i) => (
                    <div key={`page-${i}`} className={cardDivStyle}>
                      {filterBookmarkedBySearchTerm(
                        page.data,
                        bookmarkedSearchTerm,
                      ).map((cafe: BookmarkedCafeFromSupabase) => (
                        <NormalCafe
                          key={cafe.id}
                          name={cafe.name}
                          address={cafe.address}
                          phoneNum={cafe.phoneNum}
                          photoUrl={cafe.photoUrl}
                          onClick={() => handleBookmarkedCafeClick(cafe)}
                        />
                      ))}
                    </div>
                  ))}

                  {isFetchingNextBookmarkedPage && (
                    <div className="fixed bottom-4 left-4">
                      <CircularProgress />
                    </div>
                  )}

                  <div ref={bookmarkedRef} className="h-[2rem] w-[22rem]"></div>
                </div>
              )}
            </section>
          </main>

          {/* 하단 */}
          {isSearchResultPage && (
            <footer className="flex-none">
              <PageConverter
                isDarkTheme={isDarkTheme}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </footer>
          )}

          {isMainPage && (
            <footer className="flex-none">
              <Footer />
            </footer>
          )}
        </div>
      </div>

      <SubSidebar />
    </nav>
  );
}
