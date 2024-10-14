'use client';

import { useEffect, useState } from 'react';
import { useMapStore, useCheckStore } from 'utils/store';
import { shallow } from 'zustand/shallow';
import { usePathname, useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Card, List, ListItem } from '@mui/material';
import Header from './header';
import Footer from './footer';
import SubSidebar from './sub-sidebar';
import NormalCard from './normal-card';
import CollectedCard from './collected-card';

function MainItem({ icon, title, path, isDarkTheme }) {
  return (
    <ListItem
      className="grid grid-cols-[40px_auto] items-center gap-4 cursor-pointer"
      onClick={path}
    >
      <span>{icon}</span>
      <span
        className={`text-xl font-dpixel hover:text-opacity-30 ${isDarkTheme ? 'text-white' : 'text-black'} transition ease-in-out delay-100`}
      >
        {title}
      </span>
    </ListItem>
  );
}

export default function Sidebar({ session }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.5,
  });
  const { ref: bookmarkedRef, inView: bookmarkedInView } = useInView({
    threshold: 0.5,
  });

  const router = useRouter();
  const pathname = usePathname();

  const isSubSidebarOpen = useCheckStore((state) => state.isSubSidebarOpen);
  const setIsSubSidebarOpen = useCheckStore(
    (state) => state.setIsSubSidebarOpen
  );
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);

  const allCafe = useMapStore((state) => state.allCafe, shallow);
  const collectedCafe = useMapStore((state) => state.collectedCafe, shallow);
  const collectedCount = useMapStore((state) => state.collectedCafeCount);
  const bookmarkedCafe = useMapStore((state) => state.bookmarkedCafe, shallow);

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

  const handleNormalCardClick = (cafe) => {
    setIsSubSidebarOpen(true);
    router.push(`/cafe/detail/${cafe.id}`);
  };

  const handleCollectedCardClick = (cafe) => {
    setIsSubSidebarOpen(true);
    router.push(`/cafe/collected/detail/${cafe.id}`);
  };

  const handleBookmarkedCardClick = (cafe) => {
    setIsSubSidebarOpen(true);
    router.push(`/cafe/bookmarked/detail/${cafe.id}`);
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
      {/* 메인 사이드바 */}
      <Card
        className={`h-[100vh] max-h-screen w-full max-w-[22rem] px-6 rounded-none ${isDarkTheme ? 'bg-darkbg text-white' : 'bg-white'} shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll`}
      >
        <div className="flex flex-col gap-4">
          <Header img={'/image/logo_trans.webp'} />

          {/* 홈 */}
          {pathname === '/' && (
            <List className="mt-2 gap-5">
              <MainItem
                icon={
                  <i className="fa-solid fa-mug-hot text-orange-900 text-2xl"></i>
                }
                title={'모든 카페 보기'}
                path={() => router.push('/cafe/all')}
                isDarkTheme={isDarkTheme}
              />
              <MainItem
                icon={<i className="fa-solid fa-mobile text-main text-2xl"></i>}
                title={'수집한 카페 보기'}
                path={() => router.push('/cafe/collected')}
                isDarkTheme={isDarkTheme}
              />
              <MainItem
                icon={
                  <i className="fa-solid fa-star text-yellow-500 text-xl"></i>
                }
                title={'가고 싶은 카페 보기'}
                path={() => router.push('/cafe/bookmarked')}
                isDarkTheme={isDarkTheme}
              />
            </List>
          )}

          {/* 모든 카페 보기 */}
          {(pathname === '/cafe/all' ||
            pathname.startsWith('/cafe/detail') ||
            pathname === '/memo') && (
            <div className="flex flex-col gap-4 mb-3">
              {paginatedResults.map((cafe) => (
                <NormalCard
                  key={cafe.id}
                  name={cafe.place_name}
                  address={cafe.address_name}
                  phone={cafe.phone}
                  onClick={() => handleNormalCardClick(cafe)}
                />
              ))}
            </div>
          )}

          {/* 수집한 카페 보기 */}
          {(pathname === '/cafe/collected' ||
            pathname.startsWith('/cafe/collected')) && (
            <>
              <div className="flex justify-center sticky">
                <span className="font-dpixel">
                  내가 수집한 카페 : {collectedCount}장
                </span>
              </div>
              {isFetchingNextCollectedPage && (
                <div className="text-center py-2">로딩 중...</div>
              )}
              {collectedData?.pages?.map((page, i) => (
                <div className="flex flex-col gap-4 mb-3">
                  <div key={i}>
                    {page.data.map((cafe) => (
                      <CollectedCard
                        key={cafe.id}
                        name={cafe.name}
                        ratings={cafe.rating}
                        photoUrl={cafe.photoUrl}
                        address={cafe.address}
                        phone={cafe.phoneNum}
                        onClick={() => handleCollectedCardClick(cafe)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div ref={collectedRef}></div>
            </>
          )}

          {/* 가고 싶은 카페 보기 */}
          {(pathname === '/cafe/bookmarked' ||
            pathname.startsWith('/cafe/bookmarked')) && (
            <>
              {isFetchingNextBookmarkedPage && (
                <div className="text-center py-2">로딩 중...</div>
              )}
              {bookmarkedData?.pages?.map((page, i) => (
                <div key={i} className="flex flex-col gap-4 mb-3">
                  <div>
                    {page.data.map((cafe) => (
                      <NormalCard
                        key={cafe.id}
                        name={cafe.name}
                        address={cafe.address}
                        phone={cafe.phoneNum}
                        onClick={() => handleBookmarkedCardClick(cafe)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div ref={bookmarkedRef}></div>
            </>
          )}

          {/* 페이지 이동 */}
          {(pathname === '/cafe/all' ||
            pathname.startsWith('/cafe/detail') ||
            pathname === '/memo') && (
            <div
              className={`sticky bottom-0 z-20 ${isDarkTheme ? 'bg-darkbg' : 'bg-white'} py-1 font-dpixel`}
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 ${
                    currentPage === 1 ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {'<'}{' '}
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 ${
                    currentPage === totalPages ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {'>'}
                </button>
              </div>
            </div>
          )}

          {/* 유저 정보, 로그아웃 */}
          {pathname === '/' && <Footer session={session} />}
        </div>
      </Card>

      {/* 서브 사이드바 */}
      <SubSidebar
        isSubSidebarOpen={isSubSidebarOpen}
        setIsSubSidebarOpen={setIsSubSidebarOpen}
      />
    </div>
  );
}
