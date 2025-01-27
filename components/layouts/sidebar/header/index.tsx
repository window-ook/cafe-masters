'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useCheckStore } from 'utils/store';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Search from './search';
import LightDarkToggle from './light-dark-toggle';
import LogoImage from 'components/auth/shared/logo-image';

export default function Header() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const collectedCafeCount = useMapStore(state => state.collectedCafeCount);
  const bookmarkedCafeCount = useMapStore(state => state.bookmarkedCafeCount);

  const router = useRouter();
  const pathname = usePathname();

  const isCollectedPage = pathname.startsWith('/cafe/collected');
  const isBookmarkedPage = pathname.startsWith('/cafe/bookmarked');

  const handleRoute = () => router.push('/');

  return (
    <div
      className={`${isDarkTheme ? 'bg-darkbg' : 'bg-white'} z-10 top-0 sticky py-4 flex flex-col gap-6`}
    >
      <div className="flex justify-between items-center mb-2">
        <Image
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/card_transparent.webp"
          alt="logo image"
          height={10}
          width={60}
          className="w-auto h-auto"
        />
        <Tooltip title="홈페이지" placement="right-end">
          <button
            type="button"
            aria-label="홈페이지 이동 버튼"
            className="flex items-center hover:opacity-70 hover:cursor-pointer transition ease duration-300"
            onClick={handleRoute}
          >
            <LogoImage size={100} />
          </button>
        </Tooltip>
        <LightDarkToggle />
      </div>
      <Search />
      {isCollectedPage && (
        <span className="flex justify-center font-dpixel text-xl sm:text-2xl">
          TOTAL : {collectedCafeCount}
        </span>
      )}
      {isBookmarkedPage && (
        <span className="flex justify-center font-dpixel text-xl sm:text-2xl">
          TOTAL : {bookmarkedCafeCount}
        </span>
      )}
    </div>
  );
}
