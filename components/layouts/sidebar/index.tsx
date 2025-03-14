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
import { getSidebarStyle } from 'utils/styles';
import dynamic from 'next/dynamic';
import Header from './header';
import Footer from './footer';
import SidebarTabList from './main/sidebar-tab-list';
import CircularProgress from '@mui/material/CircularProgress';
import useCollectedInfiniteQuery from 'hooks/cache/useCollectedInfiniteQuery';
import useBookmarkedInfiniteQuery from 'hooks/cache/useBookmarkedInfiniteQuery';

const NormalCafe = dynamic(() => import('./main/normal-cafe'), { ssr: false });

const CollectedCafe = dynamic(() => import('./main/collected-cafe'), {
  ssr: false,
});

const PageConverter = dynamic(() => import('./footer/page-converter'), {
  ssr: false,
});

const SubSidebar = dynamic(() => import('./sub-sidebar'), { ssr: false });

export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState(1);

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
        className={getSidebarStyle(isDarkTheme, isSubSidebarOpen)}
        ref={containerRef}
      >
        <div className="flex flex-col min-h-screen">
          {/* 상단 */}
          <section className="sticky top-0 z-10">
            <Header />
          </section>

          {/* 중단 */}
          <section className="flex-1 min-h-0 overflow-y-auto">
            {isMainPage && <SidebarTabList />}

            <section className="px-8 sm:px-4">
              {isSearchResultPage && (
                <div className={cardDivStyle}>
                  {paginatedResults.map((cafe: SearchResult) => (
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
                <div>
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
                    <div className="fixed bottom-4 right-4">
                      <CircularProgress />
                    </div>
                  )}

                  <div ref={collectedRef} className="h-[2rem] w-[22rem]"></div>
                </div>
              )}

              {isBookmarkedPage && (
                <div>
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
                    <div className="fixed bottom-4 right-4">
                      <CircularProgress />
                    </div>
                  )}

                  <div ref={bookmarkedRef} className="h-[2rem] w-[22rem]"></div>
                </div>
              )}
            </section>
          </section>

          {/* 하단 */}
          {isSearchResultPage && (
            <section className="sticky bottom-0 z-10">
              <PageConverter
                isDarkTheme={isDarkTheme}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </section>
          )}

          {isMainPage && <Footer />}
        </div>
      </div>

      <SubSidebar />
    </nav>
  );
}
