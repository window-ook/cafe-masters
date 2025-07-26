'use client';

import { useState } from 'react';
import {
  getExpertTierStyle,
  getMasterTierStyle,
  masterTierBadgeStyle,
} from 'utils/styles';
import { Tier } from 'types/shared/sidebar';
import TierDialog from '@/components/shared/sidebar/TierDialog';

const TIER_STYLES = {
  BEGINNER: 'bg-beginner text-white',
  JUNIOR: 'bg-junior text-white',
  SENIOR: 'bg-senior text-white',
  EXPERT: getExpertTierStyle(),
  MASTER: getMasterTierStyle(),
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleCloseAction = () => setOpen(false);

  return (
    <>
      <div className="relative flex items-center justify-center">
        {tier === 'MASTER' && <div className={masterTierBadgeStyle}></div>}
        <button
          aria-label="티어 모달 오픈 버튼"
          onClick={() => handleOpen()}
          className={`${TIER_STYLES[tier]} w-20 h-6 py-4 rounded-xl flex items-center justify-center hover:cursor-pointer`}
        >
          <span className="text-sm font-dpixel">{tier}</span>
        </button>
      </div>
      <TierDialog open={open} handleCloseAction={handleCloseAction} />
    </>
  );
}
