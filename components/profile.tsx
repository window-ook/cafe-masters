'use client';

import TierBadge from './tier-badge';

export default function Profile({ session }) {
  return (
    <div className="flex justify-center items-center gap-4">
      <img
        src={
          'https://keybay.tech/cdn/shop/files/DSC00444.jpg?crop=center&height=2048&v=1722648109&width=2048'
        }
        alt="avatar"
        className="relative inline-block object-cover object-center w-12 h-12 rounded-lg"
      />
      <div className="flex gap-1">
        <h6 className="font-bold text-xl">
          {session?.user?.email?.split('@')?.[0]}
        </h6>
        <TierBadge tier={'MASTER'} />
      </div>
    </div>
  );
}
