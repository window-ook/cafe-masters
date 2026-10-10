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
      className={`rounded-lg border px-3 py-1 text-sm font-medium ${isDarkTheme
        ? 'border-paper-dark-edge bg-paper-dark text-white hover:bg-gray-700'
        : 'text-text-primary border-paper-edge bg-paper hover:bg-white'
        } transition-all duration-200 ease-out`}
    >
      처음으로
    </Link>
  );
}
