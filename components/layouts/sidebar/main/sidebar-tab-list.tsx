'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckStore, useMapStore } from 'utils/store';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdCafe } from 'react-icons/io';
import { MdCollections, MdCollectionsBookmark } from 'react-icons/md';
import { FaRegCircleQuestion } from 'react-icons/fa6';

interface SidebarTabProps {
  icon: ReactNode;
  title: string;
  path: string;
  isDarkTheme: boolean;
}

const SidebarTab = ({ icon, title, path, isDarkTheme }: SidebarTabProps) => {
  const searchResult = useMapStore(state => state.searchResult);
  const collectedCafeCount = useMapStore(state => state.collectedCafeCount);
  const bookmarkedCafeCount = useMapStore(state => state.bookmarkedCafeCount);
  const recommendedCafeCount = useMapStore(state => state.recommendedCafeCount);

  const router = useRouter();

  return (
    <li
      data-cy={`route-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className={`group w-full px-3 py-4 rounded-lg flex justify-between cursor-pointer ${isDarkTheme ? 'hover:bg-main-light' : 'hover:bg-white'} hover:shadow-md transition duration-150 ease-in`}
    >
      <button
        onClick={() => router.push(path)}
        className="flex justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <p>{icon}</p>
          <p
            className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} font-bold text-2xl transition duration-150 ease-in`}
          >
            {title}
          </p>
        </div>
        <div>
          {path === '/cafe/search' && (
            <span className="font-pretendard font-bold text-lg text-gray-500 group-hover:text-main transition duration-150 ease-in">
              {searchResult.length}
            </span>
          )}
          {path === '/cafe/collected' && (
            <span className="font-pretendard font-bold text-lg text-gray-500 group-hover:text-main transition duration-150 ease-in">
              {collectedCafeCount}
            </span>
          )}
          {path === '/cafe/bookmarked' && (
            <span className="font-pretendard font-bold text-lg text-gray-500 group-hover:text-main transition duration-150 ease-in">
              {bookmarkedCafeCount}
            </span>
          )}
          {path === '/cafe/recommended' && (
            <span className="font-pretendard font-bold text-lg text-gray-500 group-hover:text-main transition duration-150 ease-in">
              {recommendedCafeCount}
            </span>
          )}
        </div>
      </button>
    </li>
  );
};

export default function SidebarTabList() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  return (
    <ul className="flex flex-col items-center">
      <SidebarTab
        icon={
          <IoMdCafe
            className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} text-3xl`}
          />
        }
        title={'검색 결과'}
        path={'/cafe/search'}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <MdCollections
            className={`${isDarkTheme ? 'text-main-shadow' : `text-main`} text-3xl`}
          />
        }
        title={'수집한 카드'}
        path={'/cafe/collected'}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={<MdCollectionsBookmark className={`text-yellow-500 text-3xl`} />}
        title={'가고 싶은 곳'}
        path={'/cafe/bookmarked'}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={<FaCheckCircle className={`text-recommended text-3xl`} />}
        title={'추천 카페'}
        path={'/cafe/recommended'}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={<FaRegCircleQuestion className={`text-gray-500 text-3xl`} />}
        title={'도움 센터'}
        path={'/cafe/help'}
        isDarkTheme={isDarkTheme}
      />
    </ul>
  );
}
