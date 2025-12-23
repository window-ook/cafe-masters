'use client';

import { ReactNode } from 'react';
import { useRecommendationCounts } from '@/hooks/supabase/recommendation';
import { useCollectionCounts } from '@/hooks/supabase/collection';
import { useBookmarkCounts } from '@/hooks/supabase/bookmark';
import { useSearchedResultStore, useUIStore, useUserStore } from '@/stores';
import { EXTERNAL_PATHS } from '@/lib/paths';
import { BookMarked, BookImage, SearchCode, ThumbsUp, Info } from 'lucide-react';
import Link from 'next/link';

interface ISideBarTab {
  testId?: string;
  icon: ReactNode;
  title: string;
  path: string;
  counts?: number;
  isDarkTheme: boolean;
  showCountBackground?: boolean;
}

const SideBarTab = ({ testId = '', icon, title, path, isDarkTheme, counts, showCountBackground = true }: ISideBarTab) => {
  const closeSlidingDrawer = useUIStore(state => state.closeSlidingDrawer);

  const handleNavClick = () => closeSlidingDrawer();

  return (
    <li>
      {path !== EXTERNAL_PATHS.GOOGLE_FORM_BUG_REPORT ?
        <Link
          href={path}
          data-testid={testId}
          onClick={handleNavClick}
          className="group w-full px-3 py-4 rounded-lg hover:bg-main-light flex justify-between cursor-pointer hover:shadow-md transition duration-100 ease-in"
        >
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
              <p>{icon}</p>
              <p className={`${isDarkTheme ? 'text-white' : 'text-gray-800'} font-bold text-2xl transition duration-150 ease-in`}>
                {title}
              </p>
            </div>
            {showCountBackground ?
              <p className="font-bold text-lg text-white px-3 py-1 rounded-full bg-main transition duration-150 ease-in">
                {counts}
              </p>
              :
              <p className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-800'} transition duration-150 ease-in`}>
                {counts}
              </p>
            }
          </div>
        </Link>
        :
        <button
          onClick={() => window.open(EXTERNAL_PATHS.GOOGLE_FORM_BUG_REPORT, '_blank')}
          className="group w-full px-3 py-4 rounded-lg hover:bg-main-light flex justify-between cursor-pointer hover:shadow-md transition duration-150 ease-in"
        >
          <div className="flex items-center gap-2">
            <p>{icon}</p>
            <p className={`${isDarkTheme ? 'text-white' : 'text-gray-800'} font-bold text-2xl transition duration-150 ease-in`}>
              {title}
            </p>
          </div>
        </button>
      }
    </li >
  );
};

export default function TabsForLink() {
  const session = useUserStore(state => state.session);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const searchResult = useSearchedResultStore(state => state.searchResult);

  const { bookmarkCounts } = useBookmarkCounts(session?.user?.id ?? '');
  const { collectionCounts } = useCollectionCounts(session?.user?.id ?? '');
  const { recommendationCounts } = useRecommendationCounts();

  return (
    <ul className="flex-1 flex flex-col">
      <SideBarTab
        testId='button-go-to-search-by-tab'
        icon={<SearchCode className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} text-3xl`} />}
        title={'검색 결과'}
        path={'/search'}
        isDarkTheme={isDarkTheme}
        counts={searchResult.length}
      />
      <SideBarTab
        testId='button-go-to-collection-by-tab'
        icon={<BookImage className={`${isDarkTheme ? 'text-main-shadow' : `text-main`} text-3xl`} />}
        title={'내가 수집한 카페'}
        path={'/collection'}
        isDarkTheme={isDarkTheme}
        counts={collectionCounts!}
        showCountBackground={!!session}
      />
      <SideBarTab
        testId='button-go-to-bookmark-by-tab'
        icon={<BookMarked className={`text-yellow-500 text-3xl`} />}
        title={'북마크한 카페'}
        path={'/bookmark'}
        isDarkTheme={isDarkTheme}
        counts={bookmarkCounts!}
        showCountBackground={!!session}
      />
      <SideBarTab
        testId='button-go-to-recommendation-by-tab'
        icon={<ThumbsUp className={`text-recommendation text-3xl`} />}
        title={'추천 카페'}
        path={'/recommendation'}
        isDarkTheme={isDarkTheme}
        counts={recommendationCounts!}
      />
      <SideBarTab
        icon={<Info className={`text-gray-500 text-3xl`} />}
        title={'버그 제보'}
        path={EXTERNAL_PATHS.GOOGLE_FORM_BUG_REPORT}
        isDarkTheme={isDarkTheme}
      />
    </ul>
  );
}