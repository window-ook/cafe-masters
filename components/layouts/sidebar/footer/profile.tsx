'use client';

import { useEffect } from 'react';
import { useMapStore, useUserStore } from 'utils/store';
import TierBadge from './tier-badge';
import Image from 'next/image';

export default function Profile({ session }: any) {
  const collectedCafeCount = useMapStore(
    (state: any) => state.collectedCafeCount
  );
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
    <div className="flex justify-center items-center gap-4">
      <Image
        src={
          'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/profile_image.webp'
        }
        alt="프로필 이미지"
        width={48}
        height={48}
        className="relative inline-block object-cover object-center rounded-lg"
      />
      <div className="flex gap-4 items-center">
        <h6 className="font-bold text-2xl font-dpixel">
          {session?.user?.email?.split('@')?.[0]}
        </h6>
        <TierBadge tier={userTier} />
      </div>
    </div>
  );
}
