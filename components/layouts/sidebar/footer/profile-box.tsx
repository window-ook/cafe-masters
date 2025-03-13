'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore, useCheckStore } from 'utils/store';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import TierBadge from './tier-badge';
import Image from 'next/image';

export default function ProfileBox() {
  const collectedCafeCount = useMapStore(state => state.collectedCafeCount);
  const userEmail = useUserStore(state => state.userEmail);
  const userTier = useUserStore(state => state.userTier);
  const setUserTier = useUserStore(state => state.setUserTier);
  const setUserEmail = useUserStore(state => state.setUserEmail);
  const setUserId = useUserStore(state => state.setUserId);
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session?.user?.id);
        setUserEmail(session?.user?.email || '');
        // setUserEmail(session?.user?.email?.split('@')?.[0] || '');
      }
    };

    fetchUserSession();
  }, [supabase, setUserEmail, setUserId]);

  useEffect(() => {
    if (collectedCafeCount === 50) setUserTier('MASTER');
    else if (collectedCafeCount < 50 && collectedCafeCount >= 30)
      setUserTier('EXPERT');
    else if (collectedCafeCount < 30 && collectedCafeCount >= 16)
      setUserTier('SENIOR');
    else if (collectedCafeCount < 16 && collectedCafeCount >= 6)
      setUserTier('JUNIOR');
    else if (collectedCafeCount < 6) setUserTier('BEGINNER');
  }, [collectedCafeCount, setUserTier]);

  return (
    <div className="w-full flex items-center gap-2">
      <div
        className={`w-full pl-1 py-1 rounded-xl ${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-300'} shadow-md flex items-center sm:gap-6`}
      >
        <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-mainLanding flex items-center justify-center">
          <Image
            src={'/image/profile_logo.avif'}
            alt="유저 프로필 이미지"
            width={20}
            height={20}
            className="inline-block object-cover object-center rounded-lg w-[1rem] h-auto"
          />
        </div>
        <span className="pl-[1rem] font-bold font-pretendard text-[0.5rem] sm:text-[1rem]">
          {userEmail}
        </span>
      </div>
      <TierBadge tier={userTier} />
    </div>
  );
}
