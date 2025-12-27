import { copyText } from '@/utils/shared/detail';
import { MapPin, CopyCheck } from 'lucide-react';

export default function Location({ address }: { address: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex items-center gap-1">
        <MapPin className="size-4" />
        <p className="font-medium">위치</p>
      </div>
      <div className="col-span-2 flex items-center gap-4">
        <p className="text-sm">{address}</p>
        <button
          type="button"
          aria-label="주소 복사 버튼"
          onClick={() => copyText(address)}
          className="cursor-pointer hover:opacity-50"
        >
          <CopyCheck className="size-4" />
        </button>
      </div>
    </div>
  );
}
