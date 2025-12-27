'use client';

import { useState } from 'react';
import { Tier } from '@/types/shared/tier';
import TierDialog from '@/components/shared/sidebar/TierDialog';

const TIER_STYLES = {
  BEGINNER: 'bg-beginner text-white',
  JUNIOR: 'bg-junior text-white',
  SENIOR: 'bg-senior text-white',
  EXPERT:
    'bg-linear-to-r from-expert-side via-expert-via to-expert-side bg-size-[200%_200%] animate-gradient text-black shadow-md shadow-amber-700',
  MASTER:
    'z-10 relative bg-linear-to-r from-master-side via-master-via to-master-side bg-size-[200%_200%] animate-gradient text-white shadow-md',
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState<boolean>(false);

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  return (
    <>
      <div className="relative flex items-center justify-center">
        {tier === 'MASTER' && <div className="master-badge"></div>}
        <button
          aria-label="티어 다이얼로그 오픈 버튼"
          data-testid="button-open-tier-dialog-button"
          onClick={() => handleDialogOpen()}
          className={`${TIER_STYLES[tier]} flex h-6 w-20 items-center justify-center rounded-xl py-4 hover:cursor-pointer`}
        >
          <span className="font-dunggeunmo text-sm">{tier}</span>
        </button>
      </div>
      <TierDialog isOpen={open} handleDialogCloseAction={handleDialogClose} />
    </>
  );
}
