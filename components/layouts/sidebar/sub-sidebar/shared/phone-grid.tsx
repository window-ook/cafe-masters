import { handleCopyClick } from 'utils/common';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCopy } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'components/shared/tooltip';

interface PhoneNumGridProps {
  phoneNum: string | null | undefined;
}

export default function PhoneGrid({ phoneNum }: PhoneNumGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex gap-1">
        <FontAwesomeIcon icon={faPhone} />
        <span className="font-dpixel">전화번호</span>
      </div>
      <div className="col-span-2 flex gap-4">
        <span className="text-lg">{phoneNum}</span>
        <Tooltip
          comment="복사"
          component={
            <button
              type="button"
              onClick={() => handleCopyClick(phoneNum ?? '')}
              className="hover:opacity-70"
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          }
          left="8"
        />
      </div>
    </div>
  );
}
