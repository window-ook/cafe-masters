'use client';

import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Search from './search';
import LightDarkToggle from './light-dark-toggle';
import LogoImage from 'components/auth/shared/logo-image';

export default function Header() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const router = useRouter();

  const handleRoute = () => router.push('/');

  return (
    <div
      className={`${isDarkTheme ? 'bg-darkbg' : 'bg-white'} z-10 sticky top-0 py-4 flex flex-col gap-6`}
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
    </div>
  );
}
