'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFilterStore, useUIStore } from '@/stores';
import { handleSafeInput } from '@/utils/shared/safeInput';
import Button from '@/components/shared/Button';

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
    <search className="w-full rounded-xl flex gap-2">
      <input
        data-testid="search-input"
        placeholder="찾으시는 곳을 입력하세요"
        value={localKeyword}
        onChange={e => handleSafeInput(e.target.value, setLocalKeyword)}
        onKeyDown={handleKeyDown}
        className={`w-5/6 pl-3 pr-28 py-4 bg-transparent border border-gray-200 rounded-md shadow-sm font-bold text-xl sm:text-md ${isDarkTheme ? 'placeholder:text-gray-300 text-white' : 'placeholder:text-gray-400 text-gray-700'} transition duration-300 ease focus:outline-none focus:border-main hover:border-gray-300 focus:shadow`}
      />
      <Button
        type="button"
        aria-label="검색 버튼"
        dataTestId="submit-keyword-for-search"
        customClassName={`w-1/6 py-4 px-1 text-2xl ${isDarkTheme ? 'bg-main-dark' : ''}`}
        onClick={handleSearch}
        text='GO'
      />
    </search>
  );
}