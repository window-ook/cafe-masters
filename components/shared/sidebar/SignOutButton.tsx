'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useUserStore } from '@/stores/user';
import Link from 'next/link';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

export default function SignOutButton() {
  const supabase = createBrowserSupabaseClient();

  const resetUser = useUserStore(state => state.resetUser);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      resetUser();
    } catch (error) {
      console.error(CONSOLE_ERROR.SIGNOUT, error);
    }
  };

  return (
    <Link
      href='/main'
      data-testid="button-signout"
      onClick={handleSignOut}
      className="bg-main rounded-xl shadow-md w-full py-4 sm:py-2 hover:bg-main-dark flex justify-center cursor-pointer transition duration-150 ease-in"
    >
      <span className="text-white text-2xl font-semibold sm:text-lg">로그아웃</span>
    </Link>
  );
}