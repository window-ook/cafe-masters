'use client';

import { useEffect } from 'react';
import { useCollectionCounts } from '@/hooks/supabase/collection';
import { useUIStore, useUserStore } from '@/stores';
import TierBadge from '@/components/shared/sidebar/TierBadge';
import Image from 'next/image';
import { IMAGE_PATHS } from '@/lib/paths';

export default function UserProfile() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const userId = useUserStore(state => state.userId);
  const userEmail = useUserStore(state => state.userEmail);
  const userTier = useUserStore(state => state.userTier);
  const setUserTier = useUserStore(state => state.setUserTier);

  const { collectionCounts } = useCollectionCounts(userId);

  useEffect(() => {
    if (collectionCounts && collectionCounts >= 40) setUserTier('MASTER');
    else if (collectionCounts && collectionCounts < 40 && collectionCounts >= 30) setUserTier('EXPERT');
    else if (collectionCounts && collectionCounts < 30 && collectionCounts >= 20) setUserTier('SENIOR');
    else if (collectionCounts && collectionCounts < 20 && collectionCounts >= 10) setUserTier('JUNIOR');
    else if (collectionCounts && collectionCounts < 10) setUserTier('BEGINNER');
  }, [collectionCounts, setUserTier]);

  if (!userEmail) return;

  return (
    <section className="w-full flex items-center gap-2">
      <div
        className={`w-full pl-1 py-1 rounded-xl ${isDarkTheme ? 'shadow-main-shadow' : 'shadow-gray-300'} shadow-md flex items-center sm:gap-6`}
      >
        <div className="w-6 h-6 rounded-full bg-main-light flex items-center justify-center">
          <Image
            src={IMAGE_PATHS.USER_ICON}
            alt="유저 프로필 이미지"
            width={20}
            height={20}
            className="inline-block object-cover object-center w-4 h-auto rounded-lg"
          />
        </div>
        <p className="pl-4 font-bold text-[0.5rem] sm:text-[1rem]">
          {userEmail}
        </p>
      </div>
      <TierBadge tier={userTier} />
    </section>
  );
}
