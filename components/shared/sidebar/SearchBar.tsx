'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useFilterStore, useUIStore } from '@/stores';

export default function SearchBar() {
  const { keyword, setKeyword } = useFilterStore();
  const { setIsSlidingDrawerOpen, isDarkTheme } = useUIStore();

  const [localKeyword, setLocalKeyword] = useState<string>(keyword);

  const router = useRouter();

  const handleSearch = () => {
    setKeyword(localKeyword);
    setIsSlidingDrawerOpen(false);
    router.push('/search');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => { setLocalKeyword(keyword); }, [keyword]);

  return (
    <search className="w-full">
      <div className="rounded-xl flex gap-2">
        <input
          data-cy="search-input"
          className={`w-5/6 pl-3 pr-28 py-4 bg-transparent border border-slate-200 rounded-md shadow-sm font-bold text-xl sm:text-md ${isDarkTheme ? 'placeholder:text-gray-300 text-white' : 'placeholder:text-slate-400 text-slate-700'} transition duration-300 ease focus:outline-none focus:border-main hover:border-slate-300 focus:shadow`}
          placeholder="성수, 밀림, 전포 감성 ..."
          value={localKeyword}
          onChange={e => setLocalKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          data-cy="search-button"
          aria-label="검색 버튼"
          className="w-1/6 py-4 px-1 flex justify-center items-center gap-2 rounded bg-main border border-transparent transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-purple-300 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={handleSearch}
        >
          <FaMagnifyingGlass className="text-white" />
          <span className="font-pretendard text-center text-sm text-white">
            검색
          </span>
        </button>
      </div>
    </search>
  );
}
