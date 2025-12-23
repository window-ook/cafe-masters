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
      className="relative z-0 w-20 h-10 shadow-md rounded-full flex items-center cursor-pointer transition-colors duration-300 ease-in-out"
    >
      <div
        className={`absolute w-full h-full rounded-full transition-colors duration-300 ${isDarkTheme ? 'bg-gray-700/50' : 'bg-gray-200/50'}`}
      />
      <div
        className={`z-10 size-8 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${isDarkTheme ? 'translate-x-11 bg-gray-800' : 'translate-x-1 bg-white'}`}
      >
        {isDarkTheme ? (
          <MoonStar className="text-white text-sm" />
        ) : (
          <SunMedium className="text-main text-lg" />
        )}
      </div>
    </button>
  );
}
