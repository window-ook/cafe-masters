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
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllCollectedCafes } from 'actions/collectActions';
import { getAllBookmarkedCafes } from 'actions/bookmarkActions';
import { getSidebarStyle } from 'utils/styles';
import Header from './header';
import Footer from './footer';
import SubSidebar from './sub-sidebar/container';
import NormalCafe from './main/normal-cafe';
import CollectedCafe from './main/collected-cafe';
import PageConverter from './footer/page-converter';
import SidebarTabList from './main/sidebar-tab-list';
import CircularProgress from '@mui/material/CircularProgress';

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
  const collectedCount = useMapStore(state => state.collectedCafeCount);
  const bookmarkedCount = useMapStore(state => state.bookmarkedCafeCount);
  const setCollectedCafe = useMapStore(state => state.setCollectedCafe);
  const setBookmarkedCafe = useMapStore(state => state.setBookmarkedCafe);
  const setThisX = useMapStore(state => state.setThisX);
  const setThisY = useMapStore(state => state.setThisY);

  const userId = useUserStore(state => state.userId);

  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const isSubSidebarOpen = useCheckStore(state => state.isSubSidebarOpen);
  const setIsSubSidebarOpen = useCheckStore(state => state.setIsSubSidebarOpen);
  const setIsMenuOpen = useCheckStore(state => state.setIsMenuOpen);

  const router = useRouter();
  const pathname = usePathname();

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
    data: fetchedCollectedCafe,
    fetchNextPage: fetchNextCollectedPage,
    hasNextPage: hasNextCollectedPage,
    isFetchingNextPage: isFetchingNextCollectedPage,
  } = useInfiniteQuery({
    enabled: !!userId && userId !== 'no-user',
    initialPageParam: 0,
    queryKey: ['collectedCafe', userId],
    queryFn: async ({ pageParam }) => {
      const response = await getAllCollectedCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage =>
      lastPage.nextCursor !== null ? lastPage.nextCursor : null,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (fetchedCollectedCafe) {
      const allCafes = fetchedCollectedCafe.pages.flatMap(page => page.data);
      setCollectedCafe(allCafes);
    }
  }, [fetchedCollectedCafe, setCollectedCafe]);

  const {
    data: fetchedBookmarkedCafe,
    fetchNextPage: fetchNextBookmarkedPage,
    hasNextPage: hasNextBookmarkedPage,
    isFetchingNextPage: isFetchingNextBookmarkedPage,
  } = useInfiniteQuery({
    enabled: !!userId && userId !== 'no-user',
    initialPageParam: 0,
    queryKey: ['bookmarkedCafe', userId],
    queryFn: async ({ pageParam }) => {
      const response = await getAllBookmarkedCafes(userId, pageParam, 4);
      return response;
    },
    getNextPageParam: lastPage =>
      lastPage.nextCursor !== null ? lastPage.nextCursor : null,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (fetchedBookmarkedCafe) {
      const allCafes = fetchedBookmarkedCafe.pages.flatMap(page => page.data);
      setBookmarkedCafe(allCafes);
    }
  }, [fetchedBookmarkedCafe, setBookmarkedCafe]);

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

  useEffect(() => {
    if (
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
  ]);

  useEffect(() => {
    if (
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
  ]);

  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <div className="relative flex items-center">
      <div
        className={getSidebarStyle(isDarkTheme, isSubSidebarOpen)}
        ref={containerRef}
      >
        <div className="flex flex-col gap-12 sm:gap-10">
          <Header />
          {pathname === '/' && <SidebarTabList />}

          <div className="px-8 sm:px-4">
            {/* 모든 카페 */}
            {pathname.startsWith('/cafe/all') && (
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

            {/* 수집한 카드 */}
            {pathname.startsWith('/cafe/collected') && (
              <div>
                <div className="flex justify-center sticky">
                  <span className="font-dpixel">
                    수집한 카드 수 : {collectedCount}
                  </span>
                </div>

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

                {isFetchingNextCollectedPage && <CircularProgress />}

                <div ref={collectedRef} className="w-[22rem]"></div>
              </div>
            )}

            {/* 가고 싶은 카페(북마크) */}
            {pathname.startsWith('/cafe/bookmarked') && (
              <div>
                <div className="flex justify-center sticky">
                  <span className="font-dpixel">
                    북마크한 카페 수 : {bookmarkedCount}
                  </span>
                </div>

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

                {isFetchingNextBookmarkedPage && <CircularProgress />}

                <div ref={bookmarkedRef} className="w-[22rem]"></div>
              </div>
            )}
          </div>

          {pathname.startsWith('/cafe/all') && (
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
    </div>
  );
}
