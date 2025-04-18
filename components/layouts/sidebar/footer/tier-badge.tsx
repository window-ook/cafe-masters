'use client';

import { useState } from 'react';
import {
  getExpertTierStyle,
  getMasterTierStyle,
  masterTierBadgeStyle,
} from 'utils/styles';
import { Tier } from 'types/common';
import TierModal from './tier-modal';

interface TierBadgeProps {
  tier: Tier;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleCloseAction = () => setOpen(false);

  const tierStyles = {
    BEGINNER: 'bg-beginner text-white',
    JUNIOR: 'bg-junior text-white',
    SENIOR: 'bg-senior text-white',
    EXPERT: getExpertTierStyle(),
    MASTER: getMasterTierStyle(),
  };

  return (
    <>
      <div className="relative flex items-center justify-center">
        {tier === 'MASTER' && <div className={masterTierBadgeStyle}></div>}
        <button
          aria-label="티어 모달 오픈 버튼"
          onClick={() => handleOpen()}
          className={`${tierStyles[tier]} w-20 h-6 py-4 rounded-xl flex items-center justify-center hover:cursor-pointer`}
        >
          <span className="text-sm font-dpixel">{tier}</span>
        </button>
      </div>
      <TierModal open={open} handleCloseAction={handleCloseAction} />
    </>
  );
}
