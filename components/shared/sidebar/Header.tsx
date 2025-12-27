'use client';

import { useState } from 'react';
import { useBookmarkCounts } from '@/hooks/supabase/bookmark';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { useSearchedResultStore } from '@/stores/search';
import { useFilterStore, useUIStore, useUserStore } from '@/stores';
import Link from 'next/link';
import Tooltip from '@/components/shared/Tooltip';
import CategoryFilter from '@/components/shared/sidebar/CategoryFilter';
import RegionFilter from '@/components/shared/sidebar/RegionsFilter';
import RatingsFilter from '@/components/shared/sidebar/RatingsFilter';
import SearchInput from '@/components/shared/sidebar/SearchInput';
import ThemeToggleButton from '@/components/shared/sidebar/ThemeToggleButton';
import Button from '@/components/shared/Button';
import Logo from '@/components/shared/Logo';
import LinkToLandingPage from '@/components/shared/sidebar/LinkToLandingPage';

export default function Header() {
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setSearchTermInCollectionCafe = useFilterStore(
    state => state.setSearchTermInCollectionCafe,
  );
  const setSearchTermInBookmarkCafe = useFilterStore(
    state => state.setSearchTermInBookmarkCafe,
  );
  const closeSlidingDrawer = useUIStore(state => state.closeSlidingDrawer);

  const [collectionInput, setCollectionInput] = useState<string>('');
  const [bookmarkInput, setBookmarkInput] = useState<string>('');

  const { bookmarkCounts } = useBookmarkCounts(userId);

  const paths = usePathMatcher();

  const handleCollectionSearch = () =>
    setSearchTermInCollectionCafe(collectionInput);
  const handleBookmarkSearch = () => setSearchTermInBookmarkCafe(bookmarkInput);

  const handleReset = () => {
    setBookmarkInput('');
    setCollectionInput('');
    closeSlidingDrawer();
  };

  return (
    <header className="top-0 flex w-full max-w-108 flex-none flex-col gap-6 py-6">
      <div className="pr-2 sm:pr-0 flex items-center justify-between">
        <Tooltip
          comment="메인으로"
          component={
            <Link
              href="/main"
              onClick={handleReset}
              aria-label="메인페이지 이동 버튼"
              data-testid="button-go-to-main"
              className="group flex items-center transition-all duration-200 ease-out hover:cursor-pointer hover:opacity-80"
            >
              <Logo />
            </Link>
          }
          position="bottom"
        />
        <LinkToLandingPage />
      </div>

      {/* 모바일 전용 SearchInput & ThemeToggleButton */}
      {paths.isMain && (
        <div className="block w-full px-2 sm:hidden">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1">
              <SearchInput />
            </div>
            <ThemeToggleButton />
          </div>
        </div>
      )}

      {paths.isSearch && (
        <div className="flex items-center justify-center">
          <p className="text-xl">
            <span
              className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-main'}`}
            >
              {searchResult.length}
            </span>
            <span>개의 검색 결과</span>
          </p>
        </div>
      )}

      {paths.isCollection && (
        <div className="flex flex-col items-center justify-center gap-4">
          {/* 상세 검색 */}
          <div className="flex w-full items-center gap-2 pl-2">
            <input
              type="text"
              placeholder="카드 이름으로 검색"
              aria-label="수집한 카페 중 카페 이름 검색하기"
              value={collectionInput}
              onChange={e => setCollectionInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCollectionSearch();
              }}
              className={`w-5/6 bg-transparent py-4 pl-2 rounded-lg backdrop-blur-sm ${isDarkTheme
                ? 'bg-dark-background border-gray-600 text-white placeholder:text-white'
                : 'border-gray-300 text-text-primary placeholder:text-text-primary'
                } focus:ring-0 focus:outline-none`}
            />
            <Button
              aria-label="검색"
              onClick={handleCollectionSearch}
              text="검색"
              customClassName="w-1/5 py-4 px-1"
            />
          </div>
          <div className="flex w-full gap-3">
            <div className="flex-1">
              <RegionFilter />
            </div>
            <div className="flex-1">
              <RatingsFilter />
            </div>
          </div>
        </div>
      )}

      {paths.isBookmark && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="카페 이름으로 검색"
              aria-label="북마크한 카페 중 이름 검색"
              className={`w-5/6 bg-transparent py-4 pl-2 rounded-lg backdrop-blur-sm ${isDarkTheme
                ? 'bg-dark-background border-gray-600 text-white placeholder:text-white'
                : 'border-gray-300 text-text-primary placeholder:text-text-primary'
                } focus:ring-0 focus:outline-none`}
              value={bookmarkInput}
              onChange={e => setBookmarkInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleBookmarkSearch();
              }}
            />
            <Button
              aria-label="검색"
              onClick={handleBookmarkSearch}
              text="검색"
              customClassName="w-1/6 py-4 px-1"
            />
          </div>
          <div className="flex w-full gap-4 px-2">
            {userId && (
              <div className="flex items-center text-xl">
                <span
                  className={`${isDarkTheme ? 'text-white' : 'text-main'} font-bold`}
                >
                  {bookmarkCounts}
                </span>
                개
              </div>
            )}
            <RegionFilter />
          </div>
        </div>
      )}

      {paths.isRecommendation && <CategoryFilter />}
    </header>
  );
}
