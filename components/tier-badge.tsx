import { useState } from 'react';
import { Tooltip } from '@mui/material';
import {
  getExpertTierStyle,
  getMasterEffectStyle,
  getMasterTierStyle,
} from 'utils/styles';
import TierInfoModal from './tier-info-modal';

export default function TierBadge({ tier }) {
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
    <div>
      <Tooltip title="티어 정보" placement="right-end">
        <div className="relative flex items-center">
          {tier === 'MASTER' && (
            <div className={getMasterEffectStyle('w-[100%]')}></div>
          )}
          <div
            onClick={() => handleOpen()}
            className={`${tierStyles[tier]} rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer`}
          >
            <span className="text-sm font-dpixel">{tier}</span>
          </div>
        </div>
      </Tooltip>
      <TierInfoModal open={open} handleClose={handleClose} />
    </div>
  );
}
