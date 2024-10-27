'use client';

import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Search from './search';
import LightDarkToggle from './light-dark-toggle';

export default function Header() {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);
  const router = useRouter();
  return (
    <div
      className={`${isDarkTheme ? 'bg-darkbg' : 'bg-white'} z-10 sticky top-0 py-4 flex flex-col gap-6`}
    >
      <div className="flex justify-between items-center mb-2">
        <Image
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/card_transparent.webp"
          alt="logo image"
          height={60}
          width={60}
          className="w-auto h-auto"
        />
        <Tooltip title="홈으로" placement="right-end">
          <button
            className="cursor-pointer flex items-center hover:opacity-70 transition ease duration-300"
            onClick={() => router.push('/')}
          >
            <Image
              src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/logo_text.webp"
              alt="logo text"
              height={120}
              width={120}
              className="w-auto h-auto"
            />
          </button>
        </Tooltip>
        <LightDarkToggle />
      </div>
      <Search />
    </div>
  );
}
