'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';
import Search from './SearchBar';
import LightDarkToggle from './ThemeToggleButton';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Tooltip = dynamic(() => import('@/components/shared/TooltipContainer'), {
  ssr: false,
});
const CategoryFilter = dynamic(() => import('./CategoryFilter'), {
  ssr: false,
});
const RegionFilter = dynamic(() => import('./RegionsFilter'), {
  ssr: false,
});
const RatingFilter = dynamic(() => import('./RatingsFilter'), {
  ssr: false,
});

export default function Header() {
  const [collectedInput, setCollectedInput] = useState<string>('');
  const [bookmarkedInput, setBookmarkedInput] = useState<string>('');

  const searchResultCount = useMapStore(state => state.searchResult.length);

  const {
    collectedCafeCount,
    bookmarkedCafeCount,
    setSearchTermInCollectedCafe,
    setSearchTermInBookmarkedCafe,
  } = useMapStore();

  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const pathname = usePathname();

  const isSearchResultPage = pathname.startsWith('/search');
  const isCollectedPage = pathname.startsWith('/collected');
  const isBookmarkedPage = pathname.startsWith('/bookmarked');
  const isRecommendedPage = pathname.startsWith('/recommended');

  const handleCollectedSearch = () =>
    setSearchTermInCollectedCafe(collectedInput);
  const handleBookmarkedSearch = () =>
    setSearchTermInBookmarkedCafe(bookmarkedInput);

  const handleStateReset = () => {
    setBookmarkedInput('');
    setCollectedInput('');
  };

  return (
    <section
      className={`${isDarkTheme ? 'bg-main-dark' : 'bg-gray-100'} z-10 top-0 py-4 w-full max-w-108 flex flex-col gap-2`}
    >
      <div className="flex justify-between items-center mb-2">
        <Tooltip
          comment="메뉴로"
          component={
            <Link
              href="/main"
              aria-label="홈페이지 이동 버튼"
              className="flex items-center hover:opacity-70 hover:cursor-pointer transition ease duration-300"
              onClick={handleStateReset}
            >
              <Image
                src="/image/logo.avif"
                width={100}
                height={100}
                alt="로고 아이콘"
                className="w-8 h-auto"
              />
              <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
                Cafe Masters
              </span>
            </Link>
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
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              placeholder="카드 이름으로 검색"
              aria-label="수집한 카페 중 카페 이름 검색하기"
              className={`w-5/6 py-4 border-0 border-b-2 ${isDarkTheme
                ? 'bg-main-dark border-gray-600 text-white'
                : 'bg-gray-100 border-gray-300 text-slate-700'
                } placeholder:text-slate-400 focus:outline-none focus:ring-0`}
              value={collectedInput}
              onChange={e => setCollectedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCollectedSearch();
              }}
            />
            <button
              onClick={handleCollectedSearch}
              className="w-1/6 py-4 px-1 rounded-sm bg-gray-300 hover:bg-main-light transition duration-200 ease-in"
              aria-label="검색"
            >
              <span className="font-pretendard text-center text-sm text-slate-700">
                검색
              </span>
            </button>
          </div>
          <div className="flex gap-4">
            <span className="font-dpixel text-xl sm:text-2xl">
              TOTAL{' '}
              <span className={`${isDarkTheme ? 'text-white' : 'text-main'}`}>
                {collectedCafeCount}
              </span>
            </span>
            <RegionFilter />
            <RatingFilter />
          </div>
        </div>
      )}

      {isBookmarkedPage && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              placeholder="카페 이름으로 검색"
              aria-label="북마크한 카페 중 카페 이름 검색하기"
              className={`w-5/6 py-4 border-0 border-b-2 ${isDarkTheme
                ? 'bg-main-dark border-gray-600 text-white'
                : 'bg-gray-100 border-gray-300 text-slate-700'
                } placeholder:text-slate-400 focus:outline-none focus:ring-0`}
              value={bookmarkedInput}
              onChange={e => setBookmarkedInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleBookmarkedSearch();
              }}
            />
            <button
              onClick={handleBookmarkedSearch}
              className="w-1/6 py-4 px-1 rounded-sm bg-gray-300 hover:bg-main-light transition duration-200 ease-in"
              aria-label="검색"
            >
              <span className="font-pretendard text-center text-sm text-slate-700">
                검색
              </span>
            </button>
          </div>
          <div className="w-full px-2 flex gap-4">
            <span className="font-dpixel text-xl sm:text-2xl">
              TOTAL{' '}
              <span className={`${isDarkTheme ? 'text-white' : 'text-main'}`}>
                {bookmarkedCafeCount}
              </span>
            </span>
            <RegionFilter />
          </div>
        </div>
      )}

      {isRecommendedPage && (
        <>
          <CategoryFilter />
        </>
      )}
    </section>
  );
}
