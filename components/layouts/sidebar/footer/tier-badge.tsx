import { useState } from 'react';
import {
  BadgeCommon,
  getExpertTierStyle,
  getMasterEffectStyle,
  getMasterTierStyle,
} from 'utils/styles';
import { Tier } from 'types/common';
import TierInfoModal from './tier-info-modal';
import Tooltip from 'components/shared/tooltip';

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
      <Tooltip
        comment="티어 정보"
        component={
          <div className="relative flex items-center justify-center">
            {tier === 'MASTER' && (
              <div className={getMasterEffectStyle('w-[100%]')}></div>
            )}
            <button
              aria-label="티어 모달 오픈 버튼"
              onClick={() => handleOpen()}
              className={`${tierStyles[tier]} ${BadgeCommon} hover:cursor-pointer`}
            >
              <span className="text-md font-dpixel">{tier}</span>
            </button>
          </div>
        }
        left="16"
      />

      <TierInfoModal open={open} handleClose={handleClose} />
    </>
  );
}
