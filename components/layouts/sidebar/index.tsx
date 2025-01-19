'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import {
  AllCafe,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
} from 'types/common';
import { useInView } from 'react-intersection-observer';
import { getSidebarStyle } from 'utils/styles';
import Header from './header';
import Footer from './footer';
import SubSidebar from './sub-sidebar';
import NormalCafe from './main/normal-cafe';
import CollectedCafe from './main/collected-cafe';
import PageConverter from './footer/page-converter';
import SidebarTabList from './main/sidebar-tab-list';
import CircularProgress from '@mui/material/CircularProgress';
import useCollectedCafes from 'hooks/query/useCollectedCafes';
import useBookmarkedCafes from 'hooks/query/useBookmarkedCafes';

export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.5,
  });
  const { ref: bookmarkedRef, inView: bookmarkedInView } = useInView({
    threshold: 0.5,
  });

  const allCafe = useMapStore(state => state.allCafe);
  const setThisX = useMapStore(state => state.setThisX);
  const setThisY = useMapStore(state => state.setThisY);

  const userId = useUserStore(state => state.userId);

  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const isSubSidebarOpen = useCheckStore(state => state.isSubSidebarOpen);
  const setIsSubSidebarOpen = useCheckStore(state => state.setIsSubSidebarOpen);
  const setIsMenuOpen = useCheckStore(state => state.setIsMenuOpen);

  const router = useRouter();
  const pathname = usePathname();

  const isSearchResultPage = pathname.startsWith('/cafe/all');
  const isCollectedPage = pathname.startsWith('/cafe/collected');
  const isBookmarkedPage = pathname.startsWith('/cafe/bookmarked');

  const itemsPerPage = 15;
  const totalPages = Math.ceil(allCafe.length / itemsPerPage);

  const paginatedResults = allCafe.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const cardDivStyle = 'flex flex-col gap-8 my-8 px-8';

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNormalCafeClick = (cafe: AllCafe) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/all/detail/${cafe.id}`);
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

  const {
    fetchedCollectedCafe,
    fetchNextPage: fetchNextCollectedPage,
    hasNextPage: hasNextCollectedPage,
    isFetchingNextPage: isFetchingNextCollectedPage,
  } = useCollectedCafes(userId, isCollectedPage);

  const {
    fetchedBookmarkedCafe,
    fetchNextPage: fetchNextBookmarkedPage,
    hasNextPage: hasNextBookmarkedPage,
    isFetchingNextPage: isFetchingNextBookmarkedPage,
  } = useBookmarkedCafes(userId, isBookmarkedPage);

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
    if (pathname === '/') setIsSubSidebarOpen(false);
  }, [pathname, setIsSubSidebarOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [allCafe]);

  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <nav className="relative flex items-center">
      <div
        className={getSidebarStyle(isDarkTheme, isSubSidebarOpen)}
        ref={containerRef}
      >
        <div className="flex flex-col gap-12 sm:gap-10">
          <Header />
          {pathname === '/' && <SidebarTabList />}

          {/* 사이드바 Body */}
          <section className="px-8 sm:px-4">
            {isSearchResultPage && (
              <div className={cardDivStyle}>
                {paginatedResults.map((cafe: AllCafe) => (
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
                    {page.data.map((cafe: CollectedCafeFromSupabase) => (
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

                <div ref={collectedRef} className="w-[22rem]"></div>
              </div>
            )}

            {isBookmarkedPage && (
              <div>
                {fetchedBookmarkedCafe?.pages?.map((page, i) => (
                  <div key={`page-${i}`} className={cardDivStyle}>
                    {page.data.map((cafe: BookmarkedCafeFromSupabase) => (
                      <NormalCafe
                        key={cafe.id}
                        name={cafe.name}
                        address={cafe.address}
                        phoneNum={cafe.phoneNum}
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

                <div ref={bookmarkedRef} className="w-[22rem]"></div>
              </div>
            )}
          </section>

          {isSearchResultPage && (
            <PageConverter
              isDarkTheme={isDarkTheme}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

          {pathname === '/' && <Footer />}
        </div>
      </div>

      <SubSidebar />
    </nav>
  );
}
