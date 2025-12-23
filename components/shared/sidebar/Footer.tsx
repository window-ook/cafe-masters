'use client';

import { useUserStore } from '@/stores';
import SignOutButton from '@/components/shared/sidebar/SignOutButton';
import SignInButton from '@/components/shared/sidebar/SignInButton';

export default function Footer() {
  const userId = useUserStore(state => state.userId);

  return (
    <footer className="max-w-108 w-full px-2 pb-4 flex-none flex flex-col items-center gap-6">
      {userId ? <SignOutButton /> : <SignInButton />}
    </footer>
  );
}