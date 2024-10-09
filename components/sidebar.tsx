'use client';

import { useEffect, useState } from 'react';
import { useMapStore } from 'utils/store';
import { shallow } from 'zustand/shallow';
import { usePathname, useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Card, List, ListItem, ListItemPrefix } from '@material-tailwind/react';
import Header from './header';
import Search from './search';
import Footer from './footer';
import SubSidebar from './sub-sidebar';
import NormalCard from './normal-card';
import CollectedCard from './collected-card';
import Profile from './profile';

function MainItem({ icon, title, path }) {
  return (
    <ListItem className="flex gap-4" onClick={path}>
      <ListItemPrefix>{icon}</ListItemPrefix>
      <span className="text-xl">{title}</span>
    </ListItem>
  );
}

export default function Sidebar({ session }) {
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const router = useRouter();
  const pathname = usePathname();

  const cafeAll = useMapStore((state) => state.results, shallow);
  const collectedCafes = [];

  const itemsPerPage = 15;
  const totalPages = Math.ceil(cafeAll.length / itemsPerPage);

  const paginatedResults = cafeAll.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // 수집해본 카페 무한스크롤
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useInfiniteQuery({
  //     initialPageParam: 1,
  //     queryKey: ['collectedCafes'],
  //     queryFn: ({ pageParam = 1 }) => {
  //       const start = (pageParam - 1) * 3;
  //       return {
  //         data: collectedCafes.slice(start, start + 3),
  //         page: pageParam,
  //       };
  //     },
  //     getNextPageParam: (lastPage) => {
  //       const nextPage = lastPage.page + 1;
  //       return lastPage.data.length === 3 ? nextPage : null;
  //     },
  //   });

  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  // }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="relative flex items-center">
      {/* 메인 사이드바 */}
      <Card className="h-[100vh] max-h-screen w-full max-w-[24rem] p-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll">
        <div className="flex flex-col gap-4">
          <Header img={'/image/logo.png'} />
          <Search />

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
                icon={<i className="fa-solid fa-clone text-2xl"></i>}
                title={'수집한 카페 모아보기'}
                path={() => router.push('/cafe/collected')}
              />
              <MainItem
                icon={
                  <i className="fa-solid fa-circle-xmark text-red-500 text-2xl"></i>
                }
                title={'안 가본 카페만 따로 보기'}
                path={() => router.push('/cafe/not-collected')}
              />
            </List>
          )}

          {/* 기본 검색 결과 = 모든 카페 보기 */}
          {pathname === '/cafe/all' && (
            <div>
              <div className="flex flex-col gap-4 mb-3">
                {/* {data?.pages?.map((page, i) => (
                  <div key={i} className="flex flex-col gap-4 mb-3"> */}
                {paginatedResults.map((cafe) => (
                  <NormalCard
                    key={cafe.id}
                    name={cafe.place_name}
                    address={cafe.address_name}
                    phone={cafe.phone}
                    onClick={() => setIsSubSidebarOpen(true)}
                  />
                ))}
                {/* </div>
                ))} */}
              </div>
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

          {/* 수집한 카페 보기 */}
          {/* {isFetchingNextPage && (
            <div className="text-center py-2">로딩 중...</div>
          )} */}
          {pathname === '/cafe/collected' && (
            <CollectedCard
              name={'인더매스'}
              ratings={5}
              address={'대구 삼덕동'}
              phone={'053-0000-0000'}
            />
          )}

          {/* 안 가본 카페만 따로 보기 */}
          {pathname === '/cafe/not-collected' && <div></div>}

          <div ref={ref}></div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            className="w-30 p-1 border-solid border-2 border-main"
            onClick={() => router.push('/')}
          >
            Home
          </button>
          <div className={`${pathname === '/' ? 'opacity-100' : 'opacity-0'}`}>
            <Profile session={session} />
          </div>
          <Footer session={session} />
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
