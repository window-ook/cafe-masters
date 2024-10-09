'use client';

import { useRouter } from 'next/navigation';
import { Tooltip } from '@material-tailwind/react';
import Search from './search';
import LightDarkToggle from './light-dark';

export default function Header({ img }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 py-4 bg-white">
      <div className="mb-2 flex justify-between items-center">
        <Tooltip
          content="홈으로"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button className="cursor-pointer" onClick={() => router.push('/')}>
            <img src={img} alt="brand" className="h-14" />
          </button>
        </Tooltip>
        <LightDarkToggle />
      </div>
      <Search />
    </div>
  );
}
