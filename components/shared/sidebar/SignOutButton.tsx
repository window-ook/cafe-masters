'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';
import Button from '../Button';

export default function SignOutButton() {
  const supabase = createBrowserSupabaseClient();

  const handleSignOut = async () => {
    localStorage.removeItem('checkStore');
    localStorage.removeItem('mapStore');
    localStorage.removeItem('subSidebarStore');
    localStorage.removeItem('userStore');
    await supabase.auth.signOut();
  };

  return (
    <Button
      type="button"
      aria-label="로그아웃 버튼"
      onClick={handleSignOut}
      text='로그아웃'
      customClassName='w-full'
    />
  );
}
