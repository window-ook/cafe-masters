import { useState } from 'react';
import {
  BadgeCommon,
  getExpertTierStyle,
  getMasterEffectStyle,
  getMasterTierStyle,
} from 'utils/styles';
import { Tier } from 'types/common';
import TierModal from './tier-modal';

interface TierBadgeProps {
  tier: Tier;
}

export default function TierBadge({ tier }: TierBadgeProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        {tier === 'MASTER' && (
          <div className={getMasterEffectStyle('w-[100%]')}></div>
        )}
        <button
          aria-label="티어 모달 오픈 버튼"
          onClick={() => handleOpen()}
          className={`${tierStyles[tier]} ${BadgeCommon} hover:cursor-pointer`}
        >
          <span className="text-sm font-dpixel">{tier}</span>
        </button>
      </div>
      <TierModal open={open} handleClose={handleClose} />
    </>
  );
}
