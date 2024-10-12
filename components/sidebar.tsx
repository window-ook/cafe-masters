'use client';

import { useEffect, useState } from 'react';
import { useMapStore, useCheckStore } from 'utils/store';
import { shallow } from 'zustand/shallow';
import { usePathname, useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Card, List, ListItem, ListItemPrefix } from '@material-tailwind/react';
import Header from './header';
import Footer from './footer';
import SubSidebar from './sub-sidebar';
import NormalCard from './normal-card';
import CollectedCard from './collected-card';

function MainItem({ icon, title, path }) {
  return (
    <ListItem className="flex gap-4" onClick={path}>
      <ListItemPrefix>{icon}</ListItemPrefix>
      <span className="text-xl">{title}</span>
    </ListItem>
  );
}

export default function Sidebar({ session }) {
  const [selectedCafe, setSelectedCafe] = useState(null);
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
  const allCafe = useMapStore((state) => state.allCafe, shallow);
  const collectedCafe = useMapStore((state) => state.collectedCafe, shallow);
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
    setSelectedCafe(cafe);
    setIsSubSidebarOpen(true);
    router.push(`/cafe/detail/${cafe.id}`);
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
      <Card className="h-[100vh] max-h-screen w-full max-w-[24rem] px-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll">
        <div className="flex flex-col gap-4">
          <div className="sticky top-0 z-10 py-4 bg-white">
            <Header img={'/image/logo_trans.webp'} />
          </div>

          {/* 홈 */}
          {pathname === '/' && (
            <List className="mt-2 gap-5">
              <MainItem
                icon={
                  <i className="fa-solid fa-mug-hot text-brown-600 text-2xl"></i>
                }
                title={'모든 카페 보기'}
                path={() => router.push('/cafe/all')}
              />
              <MainItem
                icon={<i className="fa-solid fa-clone text-main text-2xl"></i>}
                title={'수집한 카페 보기'}
                path={() => router.push('/cafe/collected')}
              />
              <MainItem
                icon={
                  <i className="fa-solid fa-star text-yellow-800 text-2xl"></i>
                }
                title={'가고싶은 카페 보기'}
                path={() => router.push('/cafe/bookmarked')}
              />
            </List>
          )}

          {/* 검색 결과 = 모든 카페 보기 */}
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

          {/* 수집한 카페 보기(수파 베이스, 무한 스크롤 - 서버 액션 이용하기) */}
          {/* 새로운 검색 창으로 filter 검색을 따로 하기 */}
          {pathname === '/cafe/collected' && (
            <>
              {isFetchingNextCollectedPage && (
                <div className="text-center py-2">로딩 중...</div>
              )}
              {collectedData?.pages?.map((page) => (
                <div className="flex flex-col gap-4 mb-3">
                  <div>
                    {page.data.map((cafe) => (
                      <CollectedCard
                        key={cafe.id}
                        name={cafe.name}
                        ratings={cafe.rating}
                        address={cafe.address}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div ref={collectedRef}></div>
            </>
          )}

          {/* 북마크 카페 보기 */}
          {pathname === '/cafe/bookmarked' && (
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
                        onClick={(e) => e.preventDefault()}
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
            <div className="sticky bottom-0 z-20 bg-white py-1">
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
