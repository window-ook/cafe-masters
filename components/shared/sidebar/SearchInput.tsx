'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFilterStore, useUIStore } from '@/stores';
import { handleSafeInput } from '@/utils/shared/safeInput';
import { Navigation } from 'lucide-react';

export default function SearchInput() {
  const router = useRouter();

  const keyword = useFilterStore(state => state.keyword);
  const setKeyword = useFilterStore(state => state.setKeyword);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

  const [localKeyword, setLocalKeyword] = useState<string>(keyword);

  useEffect(() => { setLocalKeyword(keyword); }, [keyword]);

  const handleSearch = () => {
    setKeyword(localKeyword);
    setIsSlidingDrawerOpen(false);
    router.push('/search');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <search className="w-full flex items-center gap-3">
      <div className="relative flex-1">
        <input
          data-testid="search-input"
          placeholder="찾으시는 곳을 입력하세요"
          value={localKeyword}
          onChange={e => handleSafeInput(e.target.value, setLocalKeyword)}
          onKeyDown={handleKeyDown}
          className={`
            w-full
            py-3 px-4 pr-12
            rounded-xl
            border
            ${isDarkTheme
              ? 'bg-gray-800/40 border-gray-600/30 text-white placeholder:text-white focus:bg-gray-800/60 focus:border-main'
              : 'bg-black/5 border-white/40 text-text-primary placeholder:text-text-primary focus:bg-white/60 focus:border-main'
            }
            text-sm font-medium
            backdrop-blur-md
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-main/20
            hover:border-opacity-60
          `}
        />
        <button
          type="button"
          aria-label="검색 버튼"
          data-testid="button-submit-keyword-for-search"
          className={`
            absolute top-1/2 right-2 -translate-y-1/2
            size-8
            rounded-lg
            bg-main
            flex items-center justify-center
            text-white
            backdrop-blur-sm
            transition-all duration-200 ease-out
            hover:bg-main-600 hover:scale-105
            active:scale-95
          `}
          onClick={handleSearch}
        >
          <Navigation className="size-4" />
        </button>
      </div>
    </search>
  );
}