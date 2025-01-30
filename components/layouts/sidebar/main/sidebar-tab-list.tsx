import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { getSidebarTabTextStyle } from 'utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableList,
  faFile,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';

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
      className="flex items-center gap-6 cursor-pointer"
      onClick={path}
    >
      <span>{icon}</span>
      <span className={getSidebarTabTextStyle(isDarkTheme)}>{title}</span>
    </li>
  );
}

export default function SidebarTabList() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const router = useRouter();
  const iconStyle = 'fa-solid text-3xl';

  return (
    <ul className="flex flex-col items-center gap-10 sm:gap-8 pl-32">
      <SidebarTab
        icon={
          <FontAwesomeIcon
            icon={faTableList}
            className={`${isDarkTheme ? 'text-white' : ''} ${iconStyle}`}
          />
        }
        title={'모든 카페 보기'}
        path={() => router.push('/cafe/all')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <FontAwesomeIcon
            icon={faFile}
            className={`${isDarkTheme ? 'text-white' : 'text-main'} ${iconStyle}`}
          />
        }
        title={'수집한 카드 보기'}
        path={() => router.push('/cafe/collected')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <FontAwesomeIcon
            icon={faBookmark}
            className={`${isDarkTheme ? 'text-white' : 'text-yellow-500'} ${iconStyle}`}
          />
        }
        title={'가고 싶은 카페 보기'}
        path={() => router.push('/cafe/bookmarked')}
        isDarkTheme={isDarkTheme}
      />
    </ul>
  );
}
