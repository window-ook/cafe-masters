'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';
import { SearchButtonStyle } from 'utils/styles';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function Search() {
  const keyword = useMapStore(state => state.keyword);
  const setKeyword = useMapStore(state => state.setKeyword);
  const setIsSubSidebarOpen = useCheckStore(state => state.setIsSubSidebarOpen);
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const [localKeyword, setLocalKeyword] = useState(keyword);

  const router = useRouter();

  const handleSearch = () => {
    setKeyword(localKeyword);
    setIsSubSidebarOpen(false);
    router.push('/cafe/search');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  return (
    <div className="w-full min-w-[12.5rem]">
      <div
        className={`relative rounded-xl shadow-md ${isDarkTheme && 'shadow-gray-700'}`}
      >
        <input
          data-cy="search-input"
          className={`w-full pl-3 pr-28 py-4 bg-transparent border border-slate-200 rounded-md shadow-sm font-bold text-xl sm:text-md ${isDarkTheme ? 'placeholder:text-gray-300 text-white' : 'placeholder:text-slate-400 text-slate-700'} transition duration-300 ease focus:outline-none focus:border-main hover:border-slate-300 focus:shadow`}
          placeholder="ex) 성수, 교동, 전포"
          value={localKeyword}
          onChange={e => setLocalKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          data-cy="search-button"
          type="button"
          aria-label="검색 버튼"
          className={SearchButtonStyle}
          onClick={handleSearch}
        >
          <FaMagnifyingGlass className="text-white" />
          <span className="font-pretendard">GO</span>
        </button>
      </div>
    </div>
  );
}
