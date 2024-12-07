import { handleCopyClick } from 'utils/common';
import { Tooltip } from '@mui/material';

interface PhoneNumGridProps {
  phoneNum: string | null | undefined;
}

export default function PhoneGrid({ phoneNum }: PhoneNumGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex gap-1">
        <i className="fa-solid fa-phone pt-1"></i>
        <span>전화번호</span>
      </div>
      <div className="col-span-2 flex gap-4">
        <span className="text-lg">{phoneNum}</span>
        <Tooltip title="복사" placement="right-end">
          <button
            onClick={() => handleCopyClick(phoneNum ?? '')}
            className="hover:opacity-70"
          >
            <i className="fa-solid fa-copy"></i>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
