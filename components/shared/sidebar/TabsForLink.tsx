'use client';

import { ReactNode } from 'react';
import { useRecommendationCounts } from '@/hooks/supabase/recommendation';
import { useCollectionCounts } from '@/hooks/supabase/collection';
import { useBookmarkCounts } from '@/hooks/supabase/bookmark';
import { useSearchedResultStore, useUIStore, useUserStore } from '@/stores';
import { MdCollections, MdCollectionsBookmark } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdCafe } from 'react-icons/io';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import Link from 'next/link';

interface ISideBarTab {
  icon: ReactNode;
  title: string;
  path: string;
  counts?: number;
  isDarkTheme: boolean;
}

const SideBarTab = ({ icon, title, path, isDarkTheme, counts }: ISideBarTab) => {
  const closeSlidingDrawer = useUIStore(state => state.closeSlidingDrawer);

  const handleNavClick = () => closeSlidingDrawer();

  return (
    <li>
      <Link
        href={path}
        onClick={handleNavClick}
        className={`group w-full px-3 py-4 rounded-lg ${isDarkTheme ? 'hover:bg-main' : 'hover:bg-white'} flex justify-between cursor-pointer hover:shadow-md transition duration-150 ease-in`}
      >
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <p>{icon}</p>
            <p className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} font-bold text-2xl transition duration-150 ease-in`}>
              {title}
            </p>
          </div>
          <p className={`font-bold text-lg text-gray-500 ${isDarkTheme ? 'group-hover:text-white' : 'group-hover:text-main'} transition duration-150 ease-in`}>
            {counts}
          </p>
        </div>
      </Link>
    </li >
  );
};

export default function TabsForLink() {
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const searchResult = useSearchedResultStore(state => state.searchResult);

  const { bookmarkCounts } = useBookmarkCounts(userId);
  const { collectionCounts } = useCollectionCounts(userId);
  const { recommendationCounts } = useRecommendationCounts();

  return (
    <ul className="flex-1 flex flex-col">
      <SideBarTab
        icon={
          <IoMdCafe
            className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} text-3xl`}
          />
        }
        title={'검색 결과'}
        path={'/search'}
        isDarkTheme={isDarkTheme}
        counts={searchResult.length}
      />
      <SideBarTab
        icon={
          <MdCollections
            className={`${isDarkTheme ? 'text-main-shadow' : `text-main`} text-3xl`}
          />
        }
        title={'내가 수집한 카페'}
        path={'/collection'}
        isDarkTheme={isDarkTheme}
        counts={collectionCounts!}
      />
      <SideBarTab
        icon={<MdCollectionsBookmark className={`text-yellow-500 text-3xl`} />}
        title={'북마크한 카페'}
        path={'/bookmark'}
        isDarkTheme={isDarkTheme}
        counts={bookmarkCounts!}
      />
      <SideBarTab
        icon={<FaCheckCircle className={`text-recommendation text-3xl`} />}
        title={'개발자가 추천하는 카페'}
        path={'/recommendation'}
        isDarkTheme={isDarkTheme}
        counts={recommendationCounts!}
      />
      <SideBarTab
        icon={<FaRegCircleQuestion className={`text-gray-500 text-3xl`} />}
        title={'도움 센터'}
        path={'/help'}
        isDarkTheme={isDarkTheme}
      />
    </ul>
  );
}