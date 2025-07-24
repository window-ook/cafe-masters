'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import {
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  IKakaoSearchResult,
  RecommendedCafeFromSupabase,
} from 'types/common';
import { useInView } from 'react-intersection-observer';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';
import TabsForLink from '../sidebar/TabsForLink';
import Footer from '../sidebar/Footer';
import Help from '../sidebar/HelpCenter';
import Header from '../sidebar/Header';
import useThrottle from '@/hooks/shared/useThrottle';
import CollectedCafe from '../sidebar/CollectedCafe';
import SearchResult from '../sidebar/SearchResult';
import PulseDot from './PulseDot';
import NormalCafe from '../sidebar/NormalCafe';
import PageConverter from '../sidebar/PageConverter';
import SubSidebar from './SubSideBar';

export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const userId = useUserStore(state => state.userId);
  const {
    searchResult,
    filteredRecommendedCafe,
    filteredCollectedCafe,
    filteredBookmarkedCafe,
    currentCafeId,
    setRecommendedCafe,
    setCurrentCoordX,
    setCurrentCoordY,
  } = useMapStore();
  const { isDarkTheme, isSubSidebarOpen, setIsSubSidebarOpen, setIsMenuOpen } =
    useCheckStore();

  const { ref: collectedRef, inView: collectedInView } = useInView({
    threshold: 0.5,
  });
  const { ref: bookmarkedRef, inView: bookmarkedInView } = useInView({
    threshold: 0.5,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const isMainPage = pathname === '/cafe';
  const isSearchResultPage = pathname.startsWith('/cafe/search');
  const isCollectedPage = pathname.startsWith('/cafe/collected');
  const isBookmarkedPage = pathname.startsWith('/cafe/bookmarked');
  const isRecommendedPage = pathname.startsWith('/cafe/recommended');
  const isHelpPage = pathname.startsWith('/cafe/help');

  const searchResultsPerPage = 15;
  const totalSearchResultPages = Math.ceil(
    searchResult.length / searchResultsPerPage,
  );
  const paginatedResult = searchResult.slice(
    (currentPage - 1) * searchResultsPerPage,
    currentPage * searchResultsPerPage,
  );

  const recommendedPerPage = 5;
  const totalRecommendedPages = Math.ceil(
    filteredRecommendedCafe.length / recommendedPerPage,
  );
  const paginatedRecommend = filteredRecommendedCafe.slice(
    (currentPage - 1) * recommendedPerPage,
    currentPage * recommendedPerPage,
  );

  const totalPages = isRecommendedPage
    ? totalRecommendedPages
    : totalSearchResultPages;

  const cardContainerStyle = 'flex flex-col gap-8 my-8 px-8';

  const {
    fetchNextPage: fetchNextCollectedPage,
    hasNextPage: hasNextCollectedPage,
    isFetchingNextPage: isFetchingNextCollectedPage,
  } = useCollectedCafes(userId, isCollectedPage);

  const {
    fetchNextPage: fetchNextBookmarkedPage,
    hasNextPage: hasNextBookmarkedPage,
    isFetchingNextPage: isFetchingNextBookmarkedPage,
  } = useBookmarkedCafes(userId, isBookmarkedPage);

  const fetchedRecommendedCafe = useRecommendedCafes();

  useEffect(() => {
    if (
      isCollectedPage &&
      collectedInView &&
      hasNextCollectedPage &&
      !isFetchingNextCollectedPage
    ) {
      fetchNextCollectedPage();
    }
  }, [
    collectedInView,
    hasNextCollectedPage,
    fetchNextCollectedPage,
    isFetchingNextCollectedPage,
    isCollectedPage,
  ]);

  useEffect(() => {
    if (
      isBookmarkedPage &&
      bookmarkedInView &&
      hasNextBookmarkedPage &&
      !isFetchingNextBookmarkedPage
    ) {
      fetchNextBookmarkedPage();
    }
  }, [
    bookmarkedInView,
    hasNextBookmarkedPage,
    fetchNextBookmarkedPage,
    isFetchingNextBookmarkedPage,
    isBookmarkedPage,
  ]);

  useEffect(() => {
    if (isRecommendedPage) setRecommendedCafe(fetchedRecommendedCafe || []);
  }, [fetchedRecommendedCafe, isRecommendedPage, setRecommendedCafe]);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (isMainPage) setIsSubSidebarOpen(false);
  }, [pathname, isMainPage, setIsSubSidebarOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResult]);

  const handleNextSearchResultPage = () => {
    if (currentPage < totalSearchResultPages) setCurrentPage(currentPage + 1);
  };

  const handleNextRecommendedPage = () => {
    if (currentPage < totalRecommendedPages) setCurrentPage(currentPage + 1);
  };

  const handleNextPageAction = isRecommendedPage
    ? handleNextRecommendedPage
    : handleNextSearchResultPage;

  const handlePreviousPageAction = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNormalCafeClick = useThrottle(
    (cafe: IKakaoSearchResult) => {
      setIsSubSidebarOpen(true);
      setIsMenuOpen(false);
      router.push(`/cafe/search/detail/${cafe.id}`);
      setCurrentCoordX(cafe?.x);
      setCurrentCoordY(cafe?.y);
    },
    5000,
    (cafe: IKakaoSearchResult) => parseInt(cafe.id) === currentCafeId,
  );

  const handleCollectedCafeClick = useThrottle(
    (cafe: CollectedCafeFromSupabase) => {
      setIsSubSidebarOpen(true);
      setIsMenuOpen(false);
      router.push(`/cafe/collected/detail/${cafe.id}`);
      setCurrentCoordX(cafe?.coordX);
      setCurrentCoordY(cafe?.coordY);
    },
    5000,
    (cafe: CollectedCafeFromSupabase) => cafe.id === currentCafeId,
  );

  const handleBookmarkedCafeClick = useThrottle(
    (cafe: BookmarkedCafeFromSupabase) => {
      setIsSubSidebarOpen(true);
      setIsMenuOpen(false);
      router.push(`/cafe/bookmarked/detail/${cafe.id}`);
      setCurrentCoordX(cafe?.coordX);
      setCurrentCoordY(cafe?.coordY);
    },
    5000,
    (cafe: BookmarkedCafeFromSupabase) => cafe.id === currentCafeId,
  );

  const handleRecommendedCafeClick = useThrottle(
    (cafe: RecommendedCafeFromSupabase) => {
      setIsSubSidebarOpen(true);
      setIsMenuOpen(false);
      router.push(`/cafe/recommended/detail/${cafe.id}`);
      setCurrentCoordX(cafe?.coordX);
      setCurrentCoordY(cafe?.coordY);
    },
    5000,
    (cafe: RecommendedCafeFromSupabase) => cafe.id === currentCafeId,
  );

  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <nav className="relative flex recommended-center">
      <div
        className={`z-10 relative w-screen h-screen max-w-108 px-1 rounded-none shadow-xl shadow-main-shadow ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'
          } ${isSubSidebarOpen && 'hidden sm:block'}`}
      >
        <div className="h-full flex flex-col">
          {/* 상단 */}
          <header className="flex-none">
            <Header />
          </header>

          {/* 중단 */}
          <main
            className="flex-1 overflow-y-auto overflow-x-hidden"
            ref={containerRef}
          >
            {isMainPage && <TabsForLink />}

            <section>
              {isSearchResultPage && (
                <ul className={cardContainerStyle}>
                  {paginatedResult.map((cafe: IKakaoSearchResult) => (
                    <SearchResult
                      key={cafe.id}
                      name={cafe.place_name}
                      address={cafe.road_address_name}
                      phoneNum={cafe.phone}
                      onClickAction={() => handleNormalCafeClick(cafe)}
                    />
                  ))}
                </ul>
              )}

              {isCollectedPage && (
                <div className="relative">
                  <ul className={cardContainerStyle}>
                    {filteredCollectedCafe.map(
                      (cafe: CollectedCafeFromSupabase) => (
                        <CollectedCafe
                          key={cafe.id}
                          name={cafe.name}
                          ratings={cafe.rating}
                          photoUrl={cafe.photoUrl}
                          address={cafe.address}
                          phoneNum={cafe.phoneNum}
                          onClickAction={() => handleCollectedCafeClick(cafe)}
                        />
                      ),
                    )}
                  </ul>

                  {isFetchingNextCollectedPage && <PulseDot />}

                  <div ref={collectedRef} className="h-8 w-88"></div>
                </div>
              )}

              {isBookmarkedPage && (
                <div className="relative">
                  <ul className={cardContainerStyle}>
                    {filteredBookmarkedCafe.map(
                      (cafe: BookmarkedCafeFromSupabase) => (
                        <NormalCafe
                          key={cafe.id}
                          name={cafe.name}
                          address={cafe.address}
                          phoneNum={cafe.phoneNum}
                          photoUrl={cafe.photoUrl}
                          onClickAction={() => handleBookmarkedCafeClick(cafe)}
                        />
                      ),
                    )}
                  </ul>

                  {isFetchingNextBookmarkedPage && <PulseDot />}

                  <div ref={bookmarkedRef} className="h-8 w-88"></div>
                </div>
              )}

              {isRecommendedPage && (
                <div className="relative">
                  <ul className={cardContainerStyle}>
                    {paginatedRecommend?.map(
                      (cafe: RecommendedCafeFromSupabase) => (
                        <NormalCafe
                          key={cafe.id}
                          name={cafe.name}
                          address={cafe.address}
                          phoneNum={cafe.phoneNum}
                          photoUrl={cafe.photoUrl}
                          onClickAction={() => handleRecommendedCafeClick(cafe)}
                        />
                      ),
                    )}
                  </ul>
                </div>
              )}

              {isHelpPage && <Help />}
            </section>
          </main>

          {/* 하단 */}
          {(isSearchResultPage || isRecommendedPage) && (
            <footer className="flex-none">
              <PageConverter
                isDarkTheme={isDarkTheme}
                handlePreviousPageAction={handlePreviousPageAction}
                handleNextPageAction={handleNextPageAction}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </footer>
          )}

          {isMainPage && (
            <footer className="flex-none">
              <Footer />
            </footer>
          )}
        </div>
      </div>

      <SubSidebar />
    </nav>
  );
}
