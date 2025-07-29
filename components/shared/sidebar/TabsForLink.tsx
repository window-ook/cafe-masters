'use client';

import { ReactNode } from 'react';
import { useRecommendedCafesCounts } from '@/hooks/supabase/recommendation';
import { useCollectedCafesCounts } from '@/hooks/supabase/collection';
import { useBookmarkedCafesCounts } from '@/hooks/supabase/bookmark';
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
  return (
    <Link
      href={path}
      className={`group w-full px-3 py-4 rounded-lg ${isDarkTheme ? 'hover:bg-main-light' : 'hover:bg-white'} flex justify-between cursor-pointer hover:shadow-md transition duration-150 ease-in`}
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          <p>{icon}</p>
          <p className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} font-bold text-2xl transition duration-150 ease-in`}>
            {title}
          </p>
        </div>
        <p className="font-pretendard font-bold text-lg text-gray-500 group-hover:text-main transition duration-150 ease-in">
          {counts}
        </p>
      </div>
    </Link>
  );
};

export default function TabsForLink() {
  const userId = useUserStore(state => state.userId);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const searchResult = useSearchedResultStore(state => state.searchResult);

  const { bookmarkedCounts } = useBookmarkedCafesCounts(userId);
  const { collectedCounts } = useCollectedCafesCounts(userId);
  const { recommendedCounts } = useRecommendedCafesCounts();

  return (
    <ul className="flex-1 flex flex-col items-center">
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
        path={'/collected'}
        isDarkTheme={isDarkTheme}
        counts={collectedCounts!}
      />
      <SideBarTab
        icon={<MdCollectionsBookmark className={`text-yellow-500 text-3xl`} />}
        title={'북마크한 카페'}
        path={'/bookmarked'}
        isDarkTheme={isDarkTheme}
        counts={bookmarkedCounts!}
      />
      <SideBarTab
        icon={<FaCheckCircle className={`text-recommended text-3xl`} />}
        title={'개발자가 추천하는 카페'}
        path={'/recommended'}
        isDarkTheme={isDarkTheme}
        counts={recommendedCounts!}
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