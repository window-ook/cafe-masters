import { useState } from 'react';
import { Tooltip } from '@mui/material';
import TierInfoModal from './tier-info-modal';

export default function TierBadge({ tier }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const tierStyles = {
    BEGINNER: 'bg-beginner text-white',
    JUNIOR: 'bg-junior text-white',
    SENIOR: 'bg-senior text-white',
    EXPERT:
      'bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700',
    MASTER:
      'relative z-10 bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradient text-white shadow-md',
  };

  return (
    <div>
      <Tooltip title="티어 정보" placement="right-end">
        <div className="relative flex items-center">
          {tier === 'MASTER' && (
            <div className="absolute inset-0 w-[100%] h-7 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-sm animate-tilt z-0"></div>
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
