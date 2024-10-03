'use client';

import { useState } from 'react';
import { Card, List, ListItem, ListItemPrefix } from '@material-tailwind/react';
import LogoutButton from './auth/logout-button';

export function Sidebar() {
  const [keyword, setKeyword] = useState('');
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);

  const handleSubSidebarToggle = () => {
    setIsSubSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      {/* 메인 사이드바 */}
      <Card className="h-[100vh] w-full max-w-[20rem] p-6 shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative">
        <div>
          <div className="mb-2 flex items-center gap-4 p-4">
            <img
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f21a74a1-65e0-4c8b-9b4f-80db3b5bbddb/d4gayid-ebc15d60-9420-4cbc-9680-d57650f89091.png/v1/fill/w_900,h_675/yu_gi_oh_5d_s_logo_render_by_nyaediter_d4gayid-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9Njc1IiwicGF0aCI6IlwvZlwvZjIxYTc0YTEtNjVlMC00YzhiLTliNGYtODBkYjNiNWJiZGRiXC9kNGdheWlkLWViYzE1ZDYwLTk0MjAtNGNiYy05NjgwLWQ1NzY1MGY4OTA5MS5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.KFzCdQb27TuUOrcgKc7x28oQM3T7QZ9oihSVWAnxjPc"
              alt="brand"
              className="h-1rem w-0.5rem"
            />
          </div>
          <div className="p-2">
            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <input
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-main hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="어떤 카페를 찾을까요?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button
                  className="absolute top-1 right-1 flex items-center gap-1 rounded bg-main py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-purple-300 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => {
                    setKeyword('');
                  }}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  검색
                </button>
              </div>
            </div>
          </div>
          <List>
            <ListItem className="flex gap-4" onClick={handleSubSidebarToggle}>
              <ListItemPrefix>
                <i className="fa-solid fa-mug-hot text-brown-400 text-xl"></i>
              </ListItemPrefix>
              <span className="">모든 카페 보기</span>
            </ListItem>
            <ListItem className="flex gap-4">
              <ListItemPrefix>
                <i className="fa-solid fa-clone text-xl"></i>
              </ListItemPrefix>
              <span className="">수집한 카페 모아보기</span>
            </ListItem>
            <ListItem className="flex gap-4">
              <ListItemPrefix>
                <i className="fa-solid fa-circle-xmark text-red-500 text-xl"></i>
              </ListItemPrefix>
              <span className="">안 가본 카페만 따로 보기</span>
            </ListItem>
          </List>
        </div>
        <LogoutButton />
      </Card>

      {/* 서브 사이드바 */}
      <Card
        className={`h-[90vh] w-full max-w-[20rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 ${
          isSubSidebarOpen ? 'translate-x-[2rem]' : 'translate-x-0 opacity-0'
        } z-1`}
      >
        {isSubSidebarOpen && (
          <h2 className="text-xl font-semibold">상세 정보</h2>
        )}
      </Card>
    </div>
  );
}
