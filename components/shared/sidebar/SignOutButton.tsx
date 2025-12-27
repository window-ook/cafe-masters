'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';
import { signOut } from '@/actions/supabase/authentication';
import { TOAST_SUCCESS, TOAST_ERROR } from '@/utils/constants/messages';
import { toast } from 'react-toastify';
import Button from '@/components/shared/Button';

export default function SignOutButton() {
  const router = useRouter();

  const resetUser = useUserStore(state => state.resetUser);

  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        const success = await signOut();
        if (success) {
          resetUser();
          toast.success(TOAST_SUCCESS.SIGNOUT);
          router.replace('/main');
        }
      } catch {
        toast.error(TOAST_ERROR.SIGNOUT);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="auth"
      dataTestId="button-signout"
      onClick={handleSignOut}
      disabled={isPending}
      text={isPending ? '로그아웃 중...' : '로그아웃'}
    />
  );
}
