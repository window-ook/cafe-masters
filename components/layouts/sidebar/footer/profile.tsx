'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';
import TierBadge from './tier-badge';
import Image from 'next/image';

export default function Profile() {
  const collectedCafeCount = useMapStore(
    (state: any) => state.collectedCafeCount
  );
  const userEmail = useUserStore((state: any) => state.userEmail);
  const userTier = useUserStore((state: any) => state.userTier);
  const setUserTier = useUserStore((state: any) => state.setUserTier);

  useEffect(() => {
    if (collectedCafeCount === 50) setUserTier('MASTER');
    else if (collectedCafeCount < 50 && collectedCafeCount >= 30)
      setUserTier('EXPERT');
    else if (collectedCafeCount < 30 && collectedCafeCount >= 16)
      setUserTier('SENIOR');
    else if (collectedCafeCount < 16 && collectedCafeCount >= 6)
      setUserTier('JUNIOR');
    else if (collectedCafeCount < 6) setUserTier('BEGINNER');
  }, [collectedCafeCount]);

  return (
    <div className="flex justify-center items-center gap-8 sm:gap-6">
      <Image
        src={
          'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/profile_image.webp'
        }
        alt="유저 프로필 이미지"
        width={60}
        height={60}
        className="relative inline-block object-cover object-center rounded-lg w-auto h-auto"
      />
      <div className="flex gap-4 items-center">
        <h6 className="font-bold text-3xl sm:text-2xl font-dpixel">
          {userEmail}
        </h6>
        <TierBadge tier={userTier} />
      </div>
    </div>
  );
}
