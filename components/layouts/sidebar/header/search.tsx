'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';
import { SearchButtonStyle, getSearchInputStyle } from 'utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
            type="button"
            aria-label="검색 버튼"
            className={SearchButtonStyle}
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
