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
  const setIsSlidingDrawerOpen = useUIStore(
    state => state.setIsSlidingDrawerOpen,
  );

  const [localKeyword, setLocalKeyword] = useState<string>(keyword);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const handleSearch = () => {
    setKeyword(localKeyword);
    setIsSlidingDrawerOpen(false);
    router.push('/search');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <search className="flex w-full items-center gap-3">
      <div className="relative flex-1">
        <input
          data-testid="search-input"
          placeholder="찾으시는 곳을 입력하세요"
          value={localKeyword}
          onChange={e => handleSafeInput(e.target.value, setLocalKeyword)}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl border px-4 py-3 pr-12 ${isDarkTheme
              ? 'focus:border-main border-paper-dark-edge bg-paper-dark text-white placeholder:text-white focus:bg-gray-700'
              : 'text-text-primary placeholder:text-text-primary focus:border-main border-paper-edge bg-paper focus:bg-white'
            } focus:ring-main/20 hover:border-opacity-60 text-sm font-medium transition-all duration-200 ease-out focus:ring-2 focus:ring-offset-0 focus:outline-none`}
        />
        <button
          type="button"
          aria-label="검색 버튼"
          data-testid="button-submit-keyword-for-search"
          className={`bg-main hover:bg-main-600 absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white cursor-pointer transition-all duration-200 ease-out hover:scale-105 active:scale-95`}
          onClick={handleSearch}
        >
          <Navigation className="size-4" />
        </button>
      </div>
    </search>
  );
}
