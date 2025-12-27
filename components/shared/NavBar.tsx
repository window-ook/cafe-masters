'use client';

import SearchInput from '@/components/shared/sidebar/SearchInput';
import UserProfile from '@/components/shared/sidebar/UserProfile';
import ThemeToggleButton from '@/components/shared/sidebar/ThemeToggleButton';

export default function NavBar() {
  return (
    <nav
      className={`
        z-50
        h-18
        px-4
        bg-transparent
        flex items-center justify-between
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hidden sm:flex
      `}
    >
      <div className="flex-1 max-w-md">
        <SearchInput />
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggleButton />
        <UserProfile />
      </div>
    </nav>
  );
}
