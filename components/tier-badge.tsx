import { useState } from 'react';
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
      'bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradientMove text-black shadow-md',
    MASTER:
      'bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradientMove text-white shadow-md',
  };

  return (
    <div>
      <div
        onClick={() => handleOpen()}
        className={`${tierStyles[tier]} rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer`}
      >
        <span className="text-sm font-dpixel">{tier}</span>
      </div>
      <TierInfoModal open={open} handleClose={handleClose} />
    </div>
  );
}
