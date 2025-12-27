'use client';

import { useUIStore } from '@/stores';
import Link from 'next/link';

export default function LinkToLandingPage() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <Link
      href="/"
      aria-label="처음으로 이동 버튼"
      data-testid="button-go-to-landing"
      className={`rounded-lg border px-3 py-1 text-sm font-medium backdrop-blur-md ${isDarkTheme
        ? 'border-gray-600/30 bg-gray-800/40 text-white hover:bg-gray-800/60'
        : 'text-text-primary border-white/50 bg-white/40 hover:bg-white/60'
        } transition-all duration-200 ease-out`}
    >
      처음으로
    </Link>
  );
}
