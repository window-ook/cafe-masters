import { handleCopyClick } from '../../shared/utils';
import { FaCopy } from 'react-icons/fa6';
import { IoLocation } from 'react-icons/io5';
import Tooltip from 'components/shared/tooltip';

interface LocationGridProps {
  address: string;
}

export default function LocationGrid({ address }: LocationGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex items-center gap-1">
        <IoLocation />
        <p className="font-dpixel">위치</p>
      </div>
      <div className="col-span-2 flex items-center gap-4">
        <p className="text-sm">{address}</p>
        <Tooltip
          comment="복사"
          component={
            <button
              type="button"
              onClick={() => handleCopyClick(address)}
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
