'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore, useCheckStore } from 'utils/store';
import TierBadge from './TierBadge';
import Image from 'next/image';

export default function ProfileSection() {
  const collectedCafeCount = useMapStore(state => state.collectedCafeCount);
  const userEmail = useUserStore(state => state.userEmail);
  const userTier = useUserStore(state => state.userTier);
  const setUserTier = useUserStore(state => state.setUserTier);
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  // 40 ~ 마스터, 30 ~ 39 엑스퍼트, 20 ~ 29 시니어, 10 ~ 19 주니어, 0 ~ 9 비기너

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
