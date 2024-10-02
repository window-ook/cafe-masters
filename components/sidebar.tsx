'use client';

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from '@material-tailwind/react';
import { useState } from 'react';

export function Sidebar() {
  const [keyword, setKeyword] = useState('');

  return (
    <Card className="h-[calc(100vh)] w-full max-w-[20rem] p-4 shadow-xl shadow-purple-200">
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
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="어떤 카페를 찾을까요?"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-purple-400 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-purple-300 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => {
                setKeyword('');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clip-rule="evenodd"
                />
              </svg>
              검색
            </button>
          </div>
        </div>
      </div>
      <List>
        <ListItem className="flex gap-4">
          <ListItemPrefix>
            <i className="fas fa-heart text-red-500" />
          </ListItemPrefix>
          모든 카페 보기
        </ListItem>
        <ListItem className="flex gap-4">
          <ListItemPrefix>
            <i className="fas fa-heart text-red-500" />
          </ListItemPrefix>
          수집한 카페 모아보기
        </ListItem>
        <ListItem className="flex gap-4">
          <ListItemPrefix>
            <i className="fas fa-heart text-red-500" />
          </ListItemPrefix>
          안 가본 카페만 따로 보기
        </ListItem>
      </List>
    </Card>
  );
}
