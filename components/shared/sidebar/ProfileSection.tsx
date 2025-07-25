'use client';

import { useEffect } from 'react';
import { useUIStore, useUserStore, useCafeStore } from '@/stores';
import TierBadge from './TierBadge';
import Image from 'next/image';

export default function ProfileSection() {
  const { collectedCafeCount } = useCafeStore();
  const { isDarkTheme } = useUIStore();
  const { userEmail, userTier, setUserTier } = useUserStore();

  useEffect(() => {
    if (collectedCafeCount === 40) setUserTier('MASTER');
    else if (collectedCafeCount < 40 && collectedCafeCount >= 30)
      setUserTier('EXPERT');
    else if (collectedCafeCount < 30 && collectedCafeCount >= 20)
      setUserTier('SENIOR');
    else if (collectedCafeCount < 20 && collectedCafeCount >= 10)
      setUserTier('JUNIOR');
    else if (collectedCafeCount < 10) setUserTier('BEGINNER');
  }, [collectedCafeCount, setUserTier]);

  return (
    <section className="w-full flex items-center gap-2">
      <div
        className={`w-full pl-1 py-1 rounded-xl ${isDarkTheme ? 'shadow-main-shadow' : 'shadow-gray-300'} shadow-md flex items-center sm:gap-6`}
      >
        <div className="w-6 h-6 rounded-full bg-main-light flex items-center justify-center">
          <Image
            src={'/image/profile_logo.avif'}
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
