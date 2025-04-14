'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useCheckStore, useUserStore } from 'utils/store';
import {
  SearchResult,
  BookmarkedCafeFromSupabase,
  CollectedCafeFromSupabase,
  RecommendedCafeFromSupabase,
} from 'types/common';
import { useInView } from 'react-intersection-observer';
import useBookmarkedInfiniteQuery from 'hooks/cache/useBookmarkedInfiniteQuery';
import useCollectedInfiniteQuery from 'hooks/cache/useCollectedInfiniteQuery';
import useRecommendedQuery from 'hooks/cache/useRecommendedQuery';
import SidebarTabList from './main/sidebar-tab-list';
import Header from './header';
import Footer from './footer';
import dynamic from 'next/dynamic';
import Help from './main/help';

const SearchResultList = dynamic(() => import('./main/search-result'), {
  ssr: false,
});
const CollectedCafe = dynamic(() => import('./main/collected-cafe'), {
  ssr: false,
});
const NormalCafe = dynamic(() => import('./main/normal-cafe'), { ssr: false });
const PageConverter = dynamic(() => import('./footer/page-converter'), {
  ssr: false,
});
const SubSidebar = dynamic(() => import('./sub-sidebar'), {
  ssr: false,
});
const Spinner = dynamic(() => import('./shared/spinner'), {
  ssr: false,
});

export default function Sidebar() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const userId = useUserStore(state => state.userId);
  const {
    searchResult,
    setRecommendedCafe,
    filteredRecommendedCafe,
    filteredCollectedCafe,
    filteredBookmarkedCafe,
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
  } = useCollectedInfiniteQuery(userId, isCollectedPage);

  const {
    fetchNextPage: fetchNextBookmarkedPage,
    hasNextPage: hasNextBookmarkedPage,
    isFetchingNextPage: isFetchingNextBookmarkedPage,
  } = useBookmarkedInfiniteQuery(userId, isBookmarkedPage);

  const fetchedRecommendedCafe = useRecommendedQuery();

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

  const handleNextPage = isRecommendedPage
    ? handleNextRecommendedPage
    : handleNextSearchResultPage;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNormalCafeClick = (cafe: SearchResult) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/search/detail/${cafe.id}`);
    setCurrentCoordX(cafe?.x);
    setCurrentCoordY(cafe?.y);
  };

  const handleCollectedCafeClick = (cafe: CollectedCafeFromSupabase) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/collected/detail/${cafe.id}`);
    setCurrentCoordX(cafe?.coordX);
    setCurrentCoordY(cafe?.coordY);
  };

  const handleBookmarkedCafeClick = (cafe: BookmarkedCafeFromSupabase) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/bookmarked/detail/${cafe.id}`);
    setCurrentCoordX(cafe?.coordX);
    setCurrentCoordY(cafe?.coordY);
  };

  const handleRecommendedCafeClick = (cafe: RecommendedCafeFromSupabase) => {
    setIsSubSidebarOpen(true);
    setIsMenuOpen(false);
    router.push(`/cafe/recommended/detail/${cafe.id}`);
    setCurrentCoordX(cafe?.coordX);
    setCurrentCoordY(cafe?.coordY);
  };

  if (pathname.startsWith('/resetpassword')) return null;

  return (
    <nav className="relative flex recommended-center">
      <div
        className={`z-10 relative w-screen h-screen max-w-[27rem] px-1 rounded-none shadow-xl shadow-main-shadow ${
          isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100'
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
            {isMainPage && <SidebarTabList />}

            <section>
              {isSearchResultPage && (
                <ul className={cardContainerStyle}>
                  {paginatedResult.map((cafe: SearchResult) => (
                    // 검색 리스트 컴포넌트 만들어서 대체하기
                    <SearchResultList
                      key={cafe.id}
                      name={cafe.place_name}
                      address={cafe.address_name}
                      phoneNum={cafe.phone}
                      onClick={() => handleNormalCafeClick(cafe)}
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
                          onClick={() => handleCollectedCafeClick(cafe)}
                        />
                      ),
                    )}
                  </ul>

                  {isFetchingNextCollectedPage && (
                    <div className="fixed bottom-4 left-4">
                      <Spinner width="w-4" height="h-4" border="border-4" />
                    </div>
                  )}

                  <div ref={collectedRef} className="h-[2rem] w-[22rem]"></div>
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
                          onClick={() => handleBookmarkedCafeClick(cafe)}
                        />
                      ),
                    )}
                  </ul>

                  {isFetchingNextBookmarkedPage && (
                    <div className="fixed bottom-4 left-4">
                      <Spinner width="w-4" height="h-4" border="border-4" />
                    </div>
                  )}

                  <div ref={bookmarkedRef} className="h-[2rem] w-[22rem]"></div>
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
                          onClick={() => handleRecommendedCafeClick(cafe)}
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
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
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
