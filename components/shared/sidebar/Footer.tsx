'use client';

import { useUserStore } from '@/stores';
import SignOutButton from '@/components/shared/sidebar/SignOutButton';
import SignInButton from '@/components/shared/sidebar/SignInButton';

export default function Footer() {
  const userId = useUserStore(state => state.userId);

  return (
    <footer className="flex w-full max-w-108 flex-none flex-col items-center gap-6 px-2 pb-4">
      {userId ? <SignOutButton /> : <SignInButton />}
    </footer>
  );
}
