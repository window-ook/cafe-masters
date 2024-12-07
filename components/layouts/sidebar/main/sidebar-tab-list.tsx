import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { CheckStore } from 'types/store';
import { getSidebarTabTextStyle } from 'utils/styles';

interface SidebarTabProps {
  icon: ReactNode;
  title: string;
  path: () => void;
  isDarkTheme: boolean;
}

function SidebarTab({ icon, title, path, isDarkTheme }: SidebarTabProps) {
  return (
    <li className="flex items-center gap-6 cursor-pointer" onClick={path}>
      <span>{icon}</span>
      <span className={getSidebarTabTextStyle(isDarkTheme)}>{title}</span>
    </li>
  );
}

export default function SidebarTabList() {
  const isDarkTheme = useCheckStore((state: CheckStore) => state.isDarkTheme);
  const router = useRouter();
  const iconStyle = 'fa-solid text-3xl';

  return (
    <ul className="flex flex-col items-center gap-10 sm:gap-8 pl-32">
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
