'use client';

import { useUserStore } from '@/stores';
import SignOutButton from '@/components/shared/sidebar/SignOutButton';
import SignInButton from '@/components/shared/sidebar/SignInButton';
import Profile from '@/components/shared/sidebar/Profile';

export default function Footer() {
  const { userId } = useUserStore();

  return (
    <section className="w-full max-w-108 pb-4 flex flex-col gap-6 items-center">
      <div className="h-[0.1rem] w-[97%] bg-gray-200 rounded-full"></div>
      <Profile />
      {userId ? <SignOutButton /> : <SignInButton />}
    </section>
  );
}
