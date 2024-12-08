'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';
import { CheckStore, MapStore } from 'types/store';
import { SearchButtonStyle, getSearchInputStyle } from 'utils/styles';

export default function Search() {
  const router = useRouter();
  const keyword = useMapStore((state: MapStore) => state.keyword);
  const setKeyword = useMapStore((state: MapStore) => state.setKeyword);
  const setIsSubSidebarOpen = useCheckStore(
    (state: CheckStore) => state.setIsSubSidebarOpen,
  );
  const isDarkTheme = useCheckStore((state: CheckStore) => state.isDarkTheme);

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
      <div className="w-full min-w-[200px]">
        <div
          className={`${isDarkTheme && 'shadow-gray-700'} relative shadow-md`}
        >
          <input
            className={getSearchInputStyle(isDarkTheme)}
            placeholder="ex) 성수, 교동, 전포"
            value={localKeyword}
            onChange={e => setLocalKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            aria-label="검색 버튼"
            className={SearchButtonStyle}
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
