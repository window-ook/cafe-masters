'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';
import { signOut } from '@/actions/supabase/authentication';
import { toast } from 'react-toastify';
import Button from '@/components/shared/Button';

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