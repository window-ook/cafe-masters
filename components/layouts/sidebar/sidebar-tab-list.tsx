import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { getSidebarTabItemStyle } from 'utils/styles';
import { ListItem } from '@mui/material';
import { List } from '@mui/material';

interface SidebarTabProps {
  icon: ReactNode;
  title: string;
  path: () => void;
  isDarkTheme: boolean;
}

function SidebarTab({ icon, title, path, isDarkTheme }: SidebarTabProps) {
  return (
    <ListItem
      className="grid grid-cols-[40px_auto] items-center gap-4 cursor-pointer"
      onClick={path}
    >
      <span>{icon}</span>
      <span className={getSidebarTabItemStyle(isDarkTheme)}>{title}</span>
    </ListItem>
  );
}

export default function SidebarTabList() {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);
  const router = useRouter();

  return (
    <List className="mt-2 gap-5 px-4">
      <SidebarTab
        icon={
          <i
            className={`fa-solid fa-bars text-2xl ${isDarkTheme ? 'text-white' : ''}`}
          ></i>
        }
        title={'모든 카페 보기'}
        path={() => router.push('/cafe/all')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <i
            className={`fa-solid fa-file text-2xl ${isDarkTheme ? 'text-white' : 'text-main'}`}
          ></i>
        }
        title={'수집한 카드 보기'}
        path={() => router.push('/cafe/collected')}
        isDarkTheme={isDarkTheme}
      />
      <SidebarTab
        icon={
          <i
            className={`fa-solid fa-bookmark text-xl ${isDarkTheme ? 'text-white' : 'text-yellow-500'}`}
          ></i>
        }
        title={'가고 싶은 카페 보기'}
        path={() => router.push('/cafe/bookmarked')}
        isDarkTheme={isDarkTheme}
      />
    </List>
  );
}
