'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';

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
    <button
      type="button"
      aria-label="로그아웃 버튼"
      className="bg-main rounded-xl shadow-md w-full py-4 sm:py-2 hover:bg-main-dark cursor-pointer transition duration-300 ease-in"
      onClick={handleSignOut}
    >
      <span className="text-white font-dpixel text-2xl sm:text-lg">로그아웃</span>
    </button>
  );
}
