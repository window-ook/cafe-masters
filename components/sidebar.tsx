'use client';

import { useEffect, useState } from 'react';
import { useMapStore } from 'utils/store';
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
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const router = useRouter();
  const pathname = usePathname();

  const cafeAll = useMapStore((state) => state.results, shallow);
  const cafeCollected = []; // 수파베이스 DB에서 가져온 수집한 카페 정보

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

  const handleNormalCardClick = (cafe) => {
    setSelectedCafe(cafe); // 선택된 카페 정보 설정
    setIsSubSidebarOpen(true); // 서브 사이드바 열기
    router.push(`/cafe/detail/${cafe.id}`); // 동적 라우팅
  };

  // 무한스크롤
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
      <Card className="h-[100vh] max-h-screen w-full max-w-[24rem] px-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll">
        <div className="flex flex-col gap-4">
          <div className="sticky top-0 z-10 py-4 bg-white">
            <Header img={'/image/logo.webp'} />
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
          {/* {isFetchingNextPage && (
            <div className="text-center py-2">로딩 중...</div>
          )} */}
          {/* {data?.pages?.map((page, i) => (
                  <div key={i} className="flex flex-col gap-4 mb-3"> */}
          {pathname === '/cafe/collected' && (
            <CollectedCard
              name={'인더매스'}
              ratings={5}
              address={'대구 삼덕동'}
              phone={'053-0000-0000'}
            />
          )}
          {/* </div>
                ))} */}

          <div ref={ref}></div>

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
