'use client';

import { useEffect } from 'react';
import { useCollectionCounts } from '@/hooks/supabase/collection';
import { useUIStore, useUserStore } from '@/stores';
import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import TierBadge from '@/components/shared/sidebar/TierBadge';

export default function UserProfile() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const userId = useUserStore(state => state.userId);
  const userEmail = useUserStore(state => state.userEmail);
  const userNickname = useUserStore(state => state.userNickname);
  const userGender = useUserStore(state => state.userGender);
  const userTier = useUserStore(state => state.userTier);
  const setUserTier = useUserStore(state => state.setUserTier);

  const { collectionCounts } = useCollectionCounts(userId);

  const profileImage =
    userGender === 'female'
      ? IMAGE_PATHS.USER_IMAGE_FEMALE
      : IMAGE_PATHS.USER_IMAGE_MALE;

  const displayName = userNickname || userEmail;

  useEffect(() => {
    if (collectionCounts && collectionCounts >= 40) setUserTier('MASTER');
    else if (
      collectionCounts &&
      collectionCounts < 40 &&
      collectionCounts >= 30
    )
      setUserTier('EXPERT');
    else if (
      collectionCounts &&
      collectionCounts < 30 &&
      collectionCounts >= 20
    )
      setUserTier('SENIOR');
    else if (
      collectionCounts &&
      collectionCounts < 20 &&
      collectionCounts >= 10
    )
      setUserTier('JUNIOR');
    else if (collectionCounts && collectionCounts < 10) setUserTier('BEGINNER');
  }, [collectionCounts, setUserTier]);

  if (!userEmail) return;

  return (
    <section className="flex items-center gap-3">
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-2 pr-3 transition-all duration-200 ease-out ${
          isDarkTheme
            ? 'border-paper-dark-edge bg-paper-dark hover:bg-gray-700'
            : 'border-paper-edge bg-paper hover:bg-white'
        } border hover:scale-[1.02] active:scale-[0.98]`}
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-gray-300/20 shadow-lg">
          <Image
            src={profileImage}
            alt="유저 프로필 이미지"
            width={24}
            height={24}
            className="size-6 rounded-md object-cover object-center"
          />
        </div>
        <p
          className={`max-w-32 truncate text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
        >
          {displayName}
        </p>
        <TierBadge tier={userTier} />
      </div>
    </section>
  );
}
