'use client';

import Link from 'next/link';
import { useUIStore } from '@/stores';

export default function LinkToLandingPage() {
    const isDarkTheme = useUIStore(state => state.isDarkTheme);

    return (
        <Link
            href="/"
            aria-label="처음으로 이동 버튼"
            data-testid="button-go-to-landing"
            className={`
                px-3 py-1
                rounded-lg
                backdrop-blur-md border
                text-sm font-medium
                ${isDarkTheme
                    ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-600/30 text-white'
                    : 'bg-white/40 hover:bg-white/60 border-white/50 text-text-primary'
                }
                transition-all duration-200 ease-out
            `}
        >
            처음으로
        </Link>
    );
}