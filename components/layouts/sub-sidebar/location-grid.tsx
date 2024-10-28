import { handleCopyClick } from 'utils/common';
import { Tooltip } from '@mui/material';

interface LocationGridProps {
  address: string;
}

export default function LocationGrid({ address }: LocationGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex gap-1">
        <i className="fa-solid fa-location-dot pt-1"></i>
        <span>위치</span>
      </div>
      <div className="col-span-2 flex gap-4">
        <span className="text-sm">{address}</span>
        <Tooltip title="복사" placement="right-end">
          <button
            onClick={() => handleCopyClick(address)}
            className="hover:opacity-70"
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
