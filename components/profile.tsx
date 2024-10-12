'use client';

import TierBadge from './tier-badge';

export default function Profile({ session }) {
  // collected 테이블에서 개수를 조회하여 티어 정하기
  return (
    <div className="flex justify-center items-center gap-4">
      <img
        src={
          'https://keybay.tech/cdn/shop/files/DSC00444.jpg?crop=center&height=2048&v=1722648109&width=2048'
        }
        alt="avatar"
        className="relative inline-block object-cover object-center w-12 h-12 rounded-lg"
      />
      <div className="flex gap-1 items-center">
        <h6 className="font-bold text-2xl font-dpixel">
          {session?.user?.email?.split('@')?.[0]}
        </h6>
        <TierBadge tier={'SENIOR'} />
      </div>
    </div>
  );
}
