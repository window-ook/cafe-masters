'use client';

import { useEffect } from 'react';
import { useCollectedCafesCounts } from '@/hooks/supabase/useCollectedCafes';
import { useUIStore, useUserStore } from '@/stores';
import TierBadge from './TierBadge';
import Image from 'next/image';

export default function Profile() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const userId = useUserStore(state => state.userId);
  const userEmail = useUserStore(state => state.userEmail);
  const userTier = useUserStore(state => state.userTier);
  const setUserTier = useUserStore(state => state.setUserTier);

  const { collectedCounts } = useCollectedCafesCounts(userId);

  useEffect(() => {
    if (collectedCounts && collectedCounts >= 40) setUserTier('MASTER');
    else if (collectedCounts && collectedCounts < 40 && collectedCounts >= 30) setUserTier('EXPERT');
    else if (collectedCounts && collectedCounts < 30 && collectedCounts >= 20) setUserTier('SENIOR');
    else if (collectedCounts && collectedCounts < 20 && collectedCounts >= 10) setUserTier('JUNIOR');
    else if (collectedCounts && collectedCounts < 10) setUserTier('BEGINNER');
  }, [collectedCounts, setUserTier]);

  if (!userEmail) return;

  return (
    <section className="w-full flex items-center gap-2">
      <div
        className={`w-full pl-1 py-1 rounded-xl ${isDarkTheme ? 'shadow-main-shadow' : 'shadow-gray-300'} shadow-md flex items-center sm:gap-6`}
      >
        <div className="w-6 h-6 rounded-full bg-main-light flex items-center justify-center">
          <Image
            src='https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//user_icon.gif'
            alt="유저 프로필 이미지"
            width={20}
            height={20}
            className="inline-block object-cover object-center rounded-lg w-4 h-auto"
          />
        </div>
        <p className="pl-4 font-bold font-pretendard text-[0.5rem] sm:text-[1rem]">
          {userEmail}
        </p>
      </div>
      <TierBadge tier={userTier} />
    </section>
  );
}
