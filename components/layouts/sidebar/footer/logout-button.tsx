'use client';

import { Button } from '@mui/material';
import { getLogoutButtonStyle } from 'utils/styles';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function LogoutButton() {
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    localStorage.removeItem('checkStore');
    localStorage.removeItem('mapStore');
    localStorage.removeItem('subSidebarStore');
    localStorage.removeItem('userStore');
    supabase.auth.signOut();
  };

  return (
    <Button
      aria-label="로그아웃 버튼"
      className={getLogoutButtonStyle()}
      onClick={handleLogout}
    >
      <span className="text-white text-2xl sm:text-lg font-dpixel">
        로그아웃
      </span>
    </Button>
  );
}
