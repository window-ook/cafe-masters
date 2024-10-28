import { useState } from 'react';
import { Tooltip } from '@mui/material';
import {
  getBadgeCommon,
  getExpertTierStyle,
  getMasterEffectStyle,
  getMasterTierStyle,
} from 'utils/styles';
import { TierBadgeProps } from 'types/types';
import TierInfoModal from './tier-info-modal';

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
    <div className="hover:opacity-70 transform duration-500 ease-in">
      <Tooltip title="티어 정보" placement="right-end">
        <div className="relative flex items-center justify-center">
          {tier === 'MASTER' && (
            <div className={getMasterEffectStyle('w-[100%]')}></div>
          )}
          <div
            onClick={() => handleOpen()}
            className={`${tierStyles[tier]} ${getBadgeCommon} hover:cursor-pointer`}
          >
            <span className="text-md font-dpixel">{tier}</span>
          </div>
        </div>
      </Tooltip>
      <TierInfoModal open={open} handleClose={handleClose} />
    </div>
  );
}
