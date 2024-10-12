'use client';

import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';
import Search from './search';
import LightDarkToggle from './light-dark-toggle';

export default function Header({ img }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 py-4 bg-white">
      <div className="mb-2 flex justify-items-start gap-20 items-center">
        <Tooltip title="홈으로" placement="right-end">
          <button
            className="cursor-pointer flex items-center"
            onClick={() => router.push('/')}
          >
            <img src={img} alt="brand" className="h-16" />
            <img src="/image/logo.webp" alt="텍스트 로고" className="h-10" />
          </button>
        </Tooltip>
        <LightDarkToggle />
      </div>
      <Search />
    </div>
  );
}
