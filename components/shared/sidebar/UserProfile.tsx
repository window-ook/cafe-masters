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
    <section className="flex items-center gap-3">
      <div
        className={`
          px-4 py-2 pr-3
          rounded-xl
          flex items-center gap-3
          transition-all duration-200 ease-out
          ${isDarkTheme
            ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-600/30'
            : 'bg-white/40 hover:bg-white/60 border-white/50'
          }
          backdrop-blur-md border
          hover:scale-[1.02] active:scale-[0.98]
        `}
      >
        <div className="size-8 rounded-lg bg-gray-300/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Image
            src={IMAGE_PATHS.USER_IMAGE}
            alt="유저 프로필 이미지"
            width={24}
            height={24}
            className="object-cover object-center size-6 rounded-md"
          />
        </div>
        <p className={`font-semibold text-sm max-w-32 truncate ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}>
          {userEmail}
        </p>
        <TierBadge tier={userTier} />
      </div>
    </section>
  );
}