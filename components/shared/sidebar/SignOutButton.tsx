'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores';
import Button from '@/components/shared/Button';

export default function SignOutButton() {
  const supabase = createBrowserSupabaseClient();

  const resetUser = useUserStore(state => state.resetUser);
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      resetUser();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <Button
      type="button"
      aria-label="로그아웃 버튼"
      onClick={handleSignOut}
      text='로그아웃'
      customClassName={`w-full ${isDarkTheme ? 'bg-main-dark' : ''}`}
    />
  );
}
