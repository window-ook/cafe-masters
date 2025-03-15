'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import Search from './search';
import LightDarkToggle from './light-dark-toggle';
import Tooltip from 'components/shared/tooltip';
import Image from 'next/image';

export default function Header() {
  const [collectedInput, setCollectedInput] = useState('');
  const [bookmarkedInput, setBookmarkedInput] = useState('');

  const searchResultCount = useMapStore(state => state.searchResult.length);
  const collectedCafeCount = useMapStore(state => state.collectedCafeCount);
  const bookmarkedCafeCount = useMapStore(state => state.bookmarkedCafeCount);
  const setCollectedSearchTerm = useMapStore(
    state => state.setCollectedSearchTerm,
  );
  const setBookmarkedSearchTerm = useMapStore(
    state => state.setBookmarkedSearchTerm,
  );

  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const router = useRouter();

  const pathname = usePathname();

  const isSearchResultPage = pathname.startsWith('/cafe/search');
  const isCollectedPage = pathname.startsWith('/cafe/collected');
  const isBookmarkedPage = pathname.startsWith('/cafe/bookmarked');

  const handleCollectedSearch = () => setCollectedSearchTerm(collectedInput);

  const handleBookmarkedSearch = () => setBookmarkedSearchTerm(bookmarkedInput);

  const handleRoute = () => router.push('/cafe');

  return (
    <div
      className={`${isDarkTheme ? 'bg-main-dark' : 'bg-gray-100'} z-10 top-0 py-4 w-full max-w-[27rem] flex flex-col gap-2`}
    >
      <div className="flex justify-between items-center mb-2">
        <Tooltip
          comment="홈페이지"
          component={
            <button
              type="button"
              aria-label="홈페이지 이동 버튼"
              className="flex items-center hover:opacity-70 hover:cursor-pointer transition ease duration-300"
              onClick={handleRoute}
            >
              <Image
                src="/image/logo.avif"
                width={100}
                height={100}
                alt="로고 아이콘"
                className="w-[2rem] h-auto"
              />
              <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
                Cafe Masters
              </span>
            </button>
          }
          left="32"
        />
        <LightDarkToggle />
      </div>
      <Search />
      {isSearchResultPage && (
        <div className="flex justify-center items-center">
          <span className="font-dpixel text-xl sm:text-2xl">
            TOTAL{' '}
            <span className={`${isDarkTheme ? 'text-white' : 'text-main'}`}>
              {searchResultCount}
            </span>
          </span>
        </div>
      )}
      {isCollectedPage && (
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="font-dpixel text-xl sm:text-2xl">
            TOTAL{' '}
            <span className={`${isDarkTheme ? 'text-white' : 'text-main'}`}>
              {collectedCafeCount}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="수집한 카드 중 찾기"
              aria-label="수집한 카페 중 카페 이름 검색하기"
              className={`px-1 py-2 border-0 border-b-2 ${
                isDarkTheme
                  ? 'bg-main-dark border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-300'
              } focus:outline-none focus:ring-0`}
              value={collectedInput}
              onChange={e => setCollectedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCollectedSearch();
              }}
            />
            <button
              onClick={handleCollectedSearch}
              className="py-2 px-3 rounded-md hover:bg-gray-100 transition duration-200 ease-in"
              aria-label="검색"
            >
              <FaMagnifyingGlass className="text-main" />
            </button>
          </div>
        </div>
      )}

      {isBookmarkedPage && (
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="font-dpixel text-xl sm:text-2xl">
            TOTAL{' '}
            <span className={`${isDarkTheme ? 'text-white' : 'text-main'}`}>
              {bookmarkedCafeCount}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="북마크한 카페 찾기"
              aria-label="북마크한 카페 중 카페 이름 검색하기"
              className={`px-1 py-2 border-0 border-b-2 ${
                isDarkTheme
                  ? 'bg-main-dark border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-300'
              } focus:outline-none focus:ring-0`}
              value={bookmarkedInput}
              onChange={e => setBookmarkedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleBookmarkedSearch();
              }}
            />
            <button
              onClick={handleBookmarkedSearch}
              className="py-2 px-3 rounded-md hover:bg-gray-100 transition duration-200 ease-in"
              aria-label="검색"
            >
              <FaMagnifyingGlass className="text-main" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
