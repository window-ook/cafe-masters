import { handleCopyClick } from 'utils/common';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCopy } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'components/shared/tooltip';

interface LocationGridProps {
  address: string;
}

export default function LocationGrid({ address }: LocationGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex gap-1">
        <FontAwesomeIcon icon={faLocationDot} />
        <span className="font-dpixel">위치</span>
      </div>
      <div className="col-span-2 flex gap-4">
        <span className="text-sm">{address}</span>
        <Tooltip
          comment="복사"
          component={
            <button
              type="button"
              onClick={() => handleCopyClick(address)}
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
