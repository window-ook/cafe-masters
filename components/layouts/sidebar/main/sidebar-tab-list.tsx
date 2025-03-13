import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { IoMdCafe } from 'react-icons/io';
import { MdCollections, MdCollectionsBookmark } from 'react-icons/md';
import { FaLaptopCode } from 'react-icons/fa';

interface SidebarTabProps {
  icon: ReactNode;
  title: string;
  path: () => void;
  isDarkTheme: boolean;
}

function SidebarTab({ icon, title, path, isDarkTheme }: SidebarTabProps) {
  return (
    <li
      data-cy={`route-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className={`group px-3 py-4 rounded-lg flex items-center gap-2 cursor-pointer ${isDarkTheme ? 'hover:bg-mainLanding' : 'hover:bg-white'} hover:shadow-md transition duration-150 ease-in`}
      onClick={path}
    >
      <span>{icon}</span>
      <span
        className={`w-[22rem] ${isDarkTheme ? 'text-white' : 'text-gray-500'} font-bold text-2xl transition duration-150 ease-in`}
      >
        {title}
      </span>
    </li>
  );
}

export default function SidebarTabList() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const router = useRouter();

  return (
    <ul className="flex flex-col items-center">
      <SidebarTab
        icon={
          <IoMdCafe
            className={`${isDarkTheme ? 'text-white' : 'text-gray-500'} text-3xl`}
          />
        }
        title={'검색 결과'}
        path={() => router.push('/cafe/all')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <MdCollections
            className={`${isDarkTheme ? 'text-mainShadow' : `text-main`} text-3xl`}
          />
        }
        title={'수집한 카드'}
        path={() => router.push('/cafe/collected')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={<MdCollectionsBookmark className={`text-yellow-500 text-3xl`} />}
        title={'가고 싶은 곳'}
        path={() => router.push('/cafe/bookmarked')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={<FaLaptopCode className={`text-gray-500 text-3xl`} />}
        title={'개발하기 좋은 카페'}
        path={() => router.push('/cafe/bookmarked')}
        isDarkTheme={isDarkTheme}
      />
    </ul>
  );
}
