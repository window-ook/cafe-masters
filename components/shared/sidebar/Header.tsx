'use client';

import { useState } from 'react';
import { useFilterStore, useUIStore, useUserStore } from '@/stores';
import { useSearchedResultStore } from '@/stores/search';
import { useBookmarkCounts } from '@/hooks/supabase/bookmark';
import { useCollectionCounts } from '@/hooks/supabase/collection';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import Link from 'next/link';
import Search from '@/components/shared/sidebar/SearchInput';
import ThemeToggleButton from '@/components/shared/sidebar/ThemeToggleButton';
import Tooltip from '@/components/shared/Tooltip';
import CategoryFilter from '@/components/shared/sidebar/CategoryFilter';
import RegionFilter from '@/components/shared/sidebar/RegionsFilter';
import RatingsFilter from '@/components/shared/sidebar/RatingsFilter';
import Button from '@/components/shared/Button';

export default function Header() {
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setSearchTermInCollectionCafe = useFilterStore(state => state.setSearchTermInCollectionCafe);
  const setSearchTermInBookmarkCafe = useFilterStore(state => state.setSearchTermInBookmarkCafe);
  const closeSlidingDrawer = useUIStore(state => state.closeSlidingDrawer);

  const [collectionInput, setCollectionInput] = useState<string>('');
  const [bookmarkInput, setBookmarkInput] = useState<string>('');

  const { collectionCounts } = useCollectionCounts(userId);
  const { bookmarkCounts } = useBookmarkCounts(userId);

  const paths = usePathMatcher();

  const handleCollectionSearch = () => setSearchTermInCollectionCafe(collectionInput);
  const handleBookmarkSearch = () => setSearchTermInBookmarkCafe(bookmarkInput);

  const handleReset = () => {
    setBookmarkInput('');
    setCollectionInput('');
    closeSlidingDrawer();
  };

  return (
    <header
      className={`top-0 w-full max-w-108 py-4 flex-none ${isDarkTheme ? 'bg-dark-background' : 'bg-sidebar-background'} flex flex-col gap-2`}
    >
      <div className="flex justify-between items-center mb-2">
        <Tooltip
          comment="메인으로"
          component={
            <Link
              href="/main"
              aria-label="메인페이지 이동 버튼"
              data-testid="button-go-to-main"
              className="flex items-center hover:opacity-70 hover:cursor-pointer transition ease duration-150"
              onClick={handleReset}
            >
              <Image
                src={IMAGE_PATHS.FALLING_CARDS_BACKGROUND}
                width={100}
                height={100}
                alt="로고 아이콘"
                className="w-8 h-auto"
              />
              <h1 className="text-3xl text-white text-shadow-black font-bold">
                Cafe Masters
              </h1>
            </Link>
          }
          position="bottom"
        />
        <ThemeToggleButton />
      </div>

      {/* 검색 바 - 입력창, 버튼 */}
      <Search />

      {paths.isSearch && (
        <div className="flex justify-center items-center">
          <p className="text-xl">
            <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-main'}`}>
              {searchResult.length}
            </span>
            <span>개의 검색 결과</span>
          </p>
        </div>
      )}

      {paths.isCollection && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              placeholder="카드 이름으로 검색"
              aria-label="수집한 카페 중 카페 이름 검색하기"
              className={`w-5/6 py-4 border-0 border-b-2 ${isDarkTheme
                ? 'bg-dark-background border-gray-600 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-700'
                } placeholder:text-gray-400 focus:outline-none focus:ring-0`}
              value={collectionInput}
              onChange={e => setCollectionInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCollectionSearch();
              }}
            />
            <Button
              aria-label="검색"
              onClick={handleCollectionSearch}
              text='검색'
              customClassName={`w-1/6 py-4 px-1 ${isDarkTheme ? 'bg-main-dark' : ''}`}
            />
          </div>
          <div className="flex gap-4">
            {userId && <div className="flex items-center text-xl">
              <span className={`${isDarkTheme ? 'text-white' : 'text-main'} font-bold`}>
                {collectionCounts}
              </span>
              개
            </div>}
            <RegionFilter />
            <RatingsFilter />
          </div>
        </div>
      )}

      {paths.isBookmark && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              placeholder="카페 이름으로 검색"
              aria-label="북마크한 카페 중 이름 검색"
              className={`w-5/6 py-4 border-0 border-b-2 ${isDarkTheme
                ? 'bg-dark-background border-gray-600 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-700'
                } placeholder:text-gray-400 focus:outline-none focus:ring-0`}
              value={bookmarkInput}
              onChange={e => setBookmarkInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleBookmarkSearch(); }}
            />
            <Button
              aria-label="검색"
              onClick={handleBookmarkSearch}
              text='검색'
              customClassName={`w-1/6 py-4 px-1 ${isDarkTheme ? 'bg-main-dark' : ''}`}
            />
          </div>
          <div className="w-full px-2 flex gap-4">
            {userId && <div className="flex items-center text-xl">
              <span className={`${isDarkTheme ? 'text-white' : 'text-main'} font-bold`}>
                {bookmarkCounts}
              </span>
              개
            </div>}
            <RegionFilter />
          </div>
        </div>
      )}

      {paths.isRecommendation && <CategoryFilter />}
    </header>
  );
}