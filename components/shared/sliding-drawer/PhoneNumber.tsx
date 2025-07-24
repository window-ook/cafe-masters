import { handleCopyClick } from '@//utils/shared/copy';
import { FaPhoneSquare } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa6';
import Tooltip from '@/components/shared/TooltipContainer';

interface PhoneNumGridProps {
  phoneNum: string | null | undefined;
}

export default function PhoneNumber({ phoneNum }: PhoneNumGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex items-center gap-1">
        <FaPhoneSquare />
        <p className="font-dpixel">전화번호</p>
      </div>
      <div className="col-span-2 flex items-center gap-4">
        <p className="text-lg">{phoneNum}</p>
        <Tooltip
          comment="복사"
          component={
            <button
              type="button"
              onClick={() => handleCopyClick(phoneNum ?? '')}
              className="hover:opacity-70"
            >
              <FaCopy />
            </button>
          }
          left="8"
        />
      </div>
    </div>
  );
}
