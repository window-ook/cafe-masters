import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { getSidebarTabItemStyle } from 'utils/styles';

interface SidebarTabProps {
  icon: ReactNode;
  title: string;
  path: () => void;
  isDarkTheme: boolean;
}

function SidebarTab({ icon, title, path, isDarkTheme }: SidebarTabProps) {
  return (
    <li
      className="grid grid-cols-[40px_auto] items-center gap-6 sm:gap-4 cursor-pointer"
      onClick={path}
    >
      <span>{icon}</span>
      <span className={getSidebarTabItemStyle(isDarkTheme)}>{title}</span>
    </li>
  );
}

export default function SidebarTabList() {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);
  const router = useRouter();
  const iconStyle = 'fa-solid text-3xl sm:text-2xl';

  return (
    <ul className="mt-2 flex flex-col gap-10 sm:gap-5 px-10 sm:px-4">
      <SidebarTab
        icon={
          <i
            className={`${isDarkTheme ? 'text-white' : ''} ${iconStyle} fa-bars`}
          ></i>
        }
        title={'모든 카페 보기'}
        path={() => router.push('/cafe/all')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <i
            className={`${isDarkTheme ? 'text-white' : 'text-main'} ${iconStyle} fa-file`}
          ></i>
        }
        title={'수집한 카드 보기'}
        path={() => router.push('/cafe/collected')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <i
            className={`${isDarkTheme ? 'text-white' : 'text-yellow-500'} ${iconStyle} fa-bookmark`}
          ></i>
        }
        title={'가고 싶은 카페 보기'}
        path={() => router.push('/cafe/bookmarked')}
        isDarkTheme={isDarkTheme}
      />
    </ul>
  );
}
