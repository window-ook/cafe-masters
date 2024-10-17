'use client';

import { useRouter } from 'next/navigation';
import { useCheckStore } from 'utils/store';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import Search from './search';
import LightDarkToggle from './light-dark-toggle';

export default function Header({ img }) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const router = useRouter();
  return (
    <div
      className={`sticky top-0 z-10 py-4 ${isDarkTheme ? 'bg-darkbg' : 'bg-white'}`}
    >
      <div className="mb-2 flex justify-between items-center">
        <Image
          src={img}
          alt="brand"
          height={1}
          width={70}
          style={{ height: 'auto' }}
        />
        <Tooltip title="홈으로" placement="right-end">
          <button
            className="cursor-pointer flex items-center hover:opacity-70 transition ease duration-300"
            onClick={() => router.push('/')}
          >
            <img src="/image/logo.webp" alt="텍스트 로고" className="h-14" />
          </button>
        </Tooltip>
        <LightDarkToggle />
      </div>
      <Search />
    </div>
  );
}
