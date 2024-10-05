'use client';

import { useState } from 'react';
import { useMapStore } from 'utils/store';
import { usePathname, useRouter } from 'next/navigation';
import { Card, List, ListItem, ListItemPrefix } from '@material-tailwind/react';
import Header from './header';
import Search from './search';
import Footer from './footer';
import SubSidebar from './sub-sidebar';

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
  const router = useRouter();
  const pathname = usePathname();
  const results = useMapStore((state) => state.results);

  return (
    <div className="relative flex items-center">
      {/* 메인 사이드바 */}
      <Card className="h-[100vh] w-full max-w-[20rem] p-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative">
        <div>
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

          {/* 검색 결과 */}
          {pathname === '/search' && (
            <div>
              {results.length > 0 && (
                <div>
                  <ul>
                    {results.slice(0, 6).map(
                      (
                        result,
                        index // 처음 6개의 결과만 표시
                      ) => (
                        <li key={index} className="mb-2 p-2 border-b">
                          <h3 className="text-lg font-semibold">
                            {result.place_name}
                          </h3>
                          <p>{result.address_name}</p>
                          <p>{result.phone}</p>
                        </li>
                      )
                    )}
                  </ul>
                  <button onClick={() => router.push('/')}>홈으로 가기</button>
                </div>
              )}
            </div>
          )}

          {/* 모든 카페 보기 */}
          {pathname === '/cafe/all' && (
            <div>
              <button onClick={() => router.push('/')}>홈으로 가기</button>
            </div>
          )}

          {/* 수집한 카페 보기 */}
          {pathname === '/cafe/collected' && (
            <div>
              <button onClick={() => router.push('/')}>홈으로 가기</button>
            </div>
          )}

          {/* 안 가본 카페만 따로 보기 */}
          {pathname === '/cafe/not-collected' && (
            <div>
              <button onClick={() => router.push('/')}>홈으로 가기</button>
            </div>
          )}
        </div>
        <Footer session={session} />
      </Card>

      {/* 서브 사이드바 */}
      <SubSidebar
        isSubSidebarOpen={isSubSidebarOpen}
        setIsSubSidebarOpen={setIsSubSidebarOpen}
      />
    </div>
  );
}
