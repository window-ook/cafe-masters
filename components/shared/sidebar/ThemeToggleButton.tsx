'use client';

import { useUIStore } from '@/stores';
import { SunMedium, MoonStar } from 'lucide-react';

export default function ThemeToggleButton() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const setIsDarkTheme = useUIStore(state => state.setIsDarkTheme);

  return (
    <button
      type="button"
      aria-label="라이트/다크 테마 토글 버튼"
      onClick={() => setIsDarkTheme()}
      className="relative z-0 flex h-10 w-20 cursor-pointer items-center rounded-full shadow-md transition-colors duration-300 ease-in-out"
    >
      <div
        className={`absolute h-full w-full rounded-full ${isDarkTheme ? 'bg-gray-700/50' : 'bg-gray-200/50'} transition-colors duration-300`}
      />
      <div
        className={`z-10 size-8 rounded-full shadow-md ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} flex transform items-center justify-center transition-transform duration-300 ease-in-out ${isDarkTheme ? 'translate-x-11' : 'translate-x-1'}`}
      >
        {isDarkTheme ? (
          <MoonStar className="text-sm text-white" />
        ) : (
          <SunMedium className="text-main text-lg" />
        )}
      </div>
    </button>
  );
}
