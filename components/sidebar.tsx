'use client';

import { useEffect, useState } from 'react';
import { useMapStore } from 'utils/store';
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
  const { ref, inView } = useInView({ threshold: 0 });
  const router = useRouter();
  const pathname = usePathname();
  const results = useMapStore((state) => state.results);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: 0,
      queryKey: ['results'],
      queryFn: ({ pageParam = 0 }) => {
        const start = pageParam * 6;
        return {
          data: results.slice(start, start + 6),
          page: pageParam,
        };
      },
      getNextPageParam: (lastPage) => {
        const nextPage = lastPage.page + 1;
        return lastPage.data.length === 6 ? nextPage : null;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="relative flex items-center">
      {/* 메인 사이드바 */}
      <Card className="h-[100vh] max-h-screen w-full max-w-[20rem] p-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll">
        <div className="flex flex-col gap-4">
          <Header
            img={
              'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f21a74a1-65e0-4c8b-9b4f-80db3b5bbddb/d4gayid-ebc15d60-9420-4cbc-9680-d57650f89091.png/v1/fill/w_900,h_675/yu_gi_oh_5d_s_logo_render_by_nyaediter_d4gayid-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9Njc1IiwicGF0aCI6IlwvZlwvZjIxYTc0YTEtNjVlMC00YzhiLTliNGYtODBkYjNiNWJiZGRiXC9kNGdheWlkLWViYzE1ZDYwLTk0MjAtNGNiYy05NjgwLWQ1NzY1MGY4OTA5MS5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.KFzCdQb27TuUOrcgKc7x28oQM3T7QZ9oihSVWAnxjPc'
            }
          />
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
              {data?.pages?.map((page, i) => (
                <div key={i} className="flex flex-col gap-4">
                  {page.data.map((cafe, index) => (
                    <NormalCard
                      name={cafe.place_name}
                      ratings={10}
                      address={cafe.address_name}
                      phone={cafe.phone}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* 수집한 카페 보기 */}
          {pathname === '/cafe/collected' && (
            <CollectedCard
              name={'인더매스'}
              ratings={10}
              address={'대구 삼덕동'}
              phone={'053-0000-0000'}
            />
          )}

          {/* 안 가본 카페만 따로 보기 */}
          {pathname === '/cafe/not-collected' && <div></div>}

          {/* 무한 스크롤 로딩 */}
          {isFetchingNextPage && (
            <div className="text-center py-2">로딩 중...</div>
          )}
          <div ref={ref}></div>
        </div>
        <div className="flex flex-col gap-1">
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
