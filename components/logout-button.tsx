'use client';

import { Button } from '@mui/material';
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
      className="bg-main rounded-xl shadow-md w-[10vw] py-2 hover:bg-opacity-70 transition duration-300 ease-in"
      onClick={handleLogout}
    >
      <span className="text-white text-lg font-dpixel">로그아웃</span>
    </Button>
  );
}
