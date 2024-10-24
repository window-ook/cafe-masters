'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapStore, useCheckStore } from 'utils/store';
import { usePathname, useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getSidebarStyle } from 'utils/styles';
import { shallow } from 'zustand/shallow';
import { Card, CircularProgress } from '@mui/material';
import Header from './header/header';
import Footer from './footer/footer';
import SubSidebar from '../sub-sidebar/sub-sidebar';
import NormalCard from './normal-card';
import CollectedCard from './collected-card';
import PageConverter from './footer/page-converter';
import SidebarList from './sidebar-tab-list';

export default function Sidebar({ session }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.5,
  });
  const { ref: bookmarkedRef, inView: bookmarkedInView } = useInView({
    threshold: 0.5,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);
  const setIsSubSidebarOpen = useCheckStore(
    (state: any) => state.setIsSubSidebarOpen
  );

  const allCafe = useMapStore((state: any) => state.allCafe, shallow);
  const collectedCafe = useMapStore(
    (state: any) => state.collectedCafe,
    shallow
  );
  const collectedCount = useMapStore((state: any) => state.collectedCafeCount);
  const bookmarkedCafe = useMapStore(
    (state: any) => state.bookmarkedCafe,
    shallow
  );

  const setThisX = useMapStore((state: any) => state.setThisX);
  const setThisY = useMapStore((state: any) => state.setThisY);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(allCafe.length / itemsPerPage);

  const paginatedResults = allCafe.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNormalCardClick = (cafe: any) => {
    setIsSubSidebarOpen(true);
    router.push(`/cafe/all/detail/${cafe.id}`);
    setThisX(cafe?.x);
    setThisY(cafe?.y);
  };

  const handleCollectedCardClick = (cafe: any) => {
    setIsSubSidebarOpen(true);
    router.push(`/cafe/collected/detail/${cafe.id}`);
    setThisX(cafe?.coordX);
    setThisY(cafe?.coordY);
  };

  const handleBookmarkedCardClick = (cafe: any) => {
    setIsSubSidebarOpen(true);
    router.push(`/cafe/bookmarked/detail/${cafe.id}`);
    setThisX(cafe?.coordX);
    setThisY(cafe?.coordY);
  };

  const {
    data: collectedData,
    fetchNextPage: fetchNextCollectedPage,
    hasNextPage: hasNextCollectedPage,
    isFetchingNextPage: isFetchingNextCollectedPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['collectedCafe', collectedCafe],
    queryFn: ({ pageParam = 1 }) => {
      const start = (pageParam - 1) * 3;
      return {
        data: collectedCafe.slice(start, start + 3),
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return lastPage.data.length === 3 ? nextPage : null;
    },
  });

  const {
    data: bookmarkedData,
    fetchNextPage: fetchNextBookmarkedPage,
    hasNextPage: hasNextBookmarkedPage,
    isFetchingNextPage: isFetchingNextBookmarkedPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['bookmarkedCafe', bookmarkedCafe],
    queryFn: ({ pageParam = 1 }) => {
      const start = (pageParam - 1) * 3;
      return {
        data: bookmarkedCafe.slice(start, start + 3),
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return lastPage.data.length === 3 ? nextPage : null;
    },
  });

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (pathname === '/') setIsSubSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (
      collectedInView &&
      hasNextCollectedPage &&
      !isFetchingNextCollectedPage
    ) {
      fetchNextCollectedPage();
    }
  }, [collectedInView, hasNextCollectedPage, fetchNextCollectedPage]);

  useEffect(() => {
    if (
      bookmarkedInView &&
      hasNextBookmarkedPage &&
      !isFetchingNextBookmarkedPage
    ) {
      fetchNextBookmarkedPage();
    }
  }, [bookmarkedInView, hasNextBookmarkedPage, fetchNextBookmarkedPage]);

  return (
    <div className="relative flex items-center">
      <Card className={getSidebarStyle(isDarkTheme)} ref={containerRef}>
        <div className="flex flex-col gap-4">
          <Header />

          {pathname === '/' && <SidebarList />}

          {pathname.startsWith('/cafe/all') && (
            <div className="flex flex-col gap-4 my-4">
              {paginatedResults.map((cafe: any) => (
                <NormalCard
                  key={cafe.id}
                  name={cafe.place_name}
                  address={cafe.address_name}
                  phoneNum={cafe.phone}
                  onClick={() => handleNormalCardClick(cafe)}
                />
              ))}
            </div>
          )}

          {pathname.startsWith('/cafe/collected') && (
            <div>
              <div className="flex justify-center sticky">
                <span className="font-dpixel">
                  내가 수집한 카드 : {collectedCount}장
                </span>
              </div>

              {isFetchingNextCollectedPage && (
                <div className="text-center py-2">
                  <CircularProgress color="secondary" />
                </div>
              )}

              {collectedData?.pages?.map((page, i) => (
                <div key={`page-${i}`} className="flex flex-col gap-4 my-4">
                  {page.data.map((cafe: any) => (
                    <CollectedCard
                      key={cafe.id}
                      name={cafe.name}
                      ratings={cafe.rating}
                      photoUrl={cafe.photoUrl}
                      address={cafe.address}
                      phoneNum={cafe.phoneNum}
                      onClick={() => handleCollectedCardClick(cafe)}
                    />
                  ))}
                </div>
              ))}
              <div ref={collectedRef}></div>
            </div>
          )}

          {pathname.startsWith('/cafe/bookmarked') && (
            <div>
              {isFetchingNextBookmarkedPage && (
                <div className="text-center py-2">
                  <CircularProgress color="secondary" />
                </div>
              )}

              {bookmarkedData?.pages?.map((page, i) => (
                <div key={`page-${i}`} className="flex flex-col gap-4 my-4">
                  {page.data.map((cafe: any) => (
                    <NormalCard
                      key={cafe.id}
                      name={cafe.name}
                      address={cafe.address}
                      phoneNum={cafe.phoneNum}
                      onClick={() => handleBookmarkedCardClick(cafe)}
                    />
                  ))}
                </div>
              ))}
              <div ref={bookmarkedRef}></div>
            </div>
          )}

          {pathname.startsWith('/cafe/all') && (
            <PageConverter
              isDarkTheme={isDarkTheme}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}

          {pathname === '/' && <Footer session={session} />}
        </div>
      </Card>

      <SubSidebar />
    </div>
  );
}
