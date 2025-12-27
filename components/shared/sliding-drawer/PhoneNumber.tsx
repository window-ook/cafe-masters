import { copyText } from '@/utils/shared/detail';
import { PhoneCall, CopyCheck } from 'lucide-react';

export default function PhoneNumber({
  phone_number,
}: {
  phone_number: string | null;
}) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex items-center gap-1">
        <PhoneCall className="size-4" />
        <p className="font-medium">전화번호</p>
      </div>
      <div className="col-span-2 flex items-center gap-4">
        <p className="text-sm">{phone_number || '미등록'}</p>
        {phone_number && (
          <button
            type="button"
            aria-label="전화번호 복사 버튼"
            onClick={() => copyText(phone_number ?? '')}
            className="cursor-pointer hover:opacity-50"
          >
            <CopyCheck className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
