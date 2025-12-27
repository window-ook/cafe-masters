'use client';

import SearchInput from '@/components/shared/sidebar/SearchInput';
import UserProfile from '@/components/shared/sidebar/UserProfile';
import ThemeToggleButton from '@/components/shared/sidebar/ThemeToggleButton';

export default function NavBar() {
  return (
    <nav className="z-50 hidden h-18 items-center justify-between bg-transparent px-4 backdrop-blur-sm transition-all duration-300 ease-in-out sm:flex">
      <div className="max-w-md flex-1">
        <SearchInput />
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggleButton />
        <UserProfile />
      </div>
    </nav>
  );
}
