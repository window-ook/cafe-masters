'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';
import { signOut } from '@/actions/supabase/authentication';
import { toast } from 'react-toastify';

export default function SignOutButton() {
  const router = useRouter();

  const resetUser = useUserStore(state => state.resetUser);

  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOut();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      resetUser();
      toast.success(result.message);
      router.replace('/main');
    });
  };

  return (
    <button
      type="button"
      data-testid="button-signout"
      onClick={handleSignOut}
      disabled={isPending}
      className="bg-main rounded-xl shadow-md w-full py-4 sm:py-2 hover:bg-main-600 flex justify-center cursor-pointer transition duration-150 ease-in disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-white text-2xl font-semibold sm:text-lg">
        {isPending ? '로그아웃 중...' : '로그아웃'}
      </span>
    </button>
  );
}