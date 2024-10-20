'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';

export default function Search() {
  const router = useRouter();
  const keyword = useMapStore((state) => state.keyword);
  const setKeyword = useMapStore((state) => state.setKeyword);
  const setIsSubSidebarOpen = useCheckStore(
    (state) => state.setIsSubSidebarOpen
  );
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);

  const [localKeyword, setLocalKeyword] = useState(keyword);

  const handleSearch = () => {
    setKeyword(localKeyword);
    setIsSubSidebarOpen(false);
    router.push('/cafe/all');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  return (
    <div className="p-2">
      <div className="w-full max-w-sm min-w-[200px]">
        <div className="relative">
          <input
            className={`w-full bg-transparent ${isDarkTheme ? 'placeholder:text-gray-200 text-white' : 'placeholder:text-slate-400 text-slate-700'} text-md border border-slate-200 rounded-md pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-main hover:border-slate-300 shadow-sm focus:shadow`}
            placeholder="ex) 성수, 동성로"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="absolute top-1 right-1 flex items-center gap-2 rounded bg-main py-3.5 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-purple-300 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleSearch}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
