import { Clock1 } from 'lucide-react';

interface IOpenTime {
  opening_time: string | null;
  isPending?: boolean;
}

export default function OpenTime({
  opening_time,
  isPending = false,
}: IOpenTime) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex items-center gap-1">
        <Clock1 className="size-4" />
        <p>영업시간</p>
      </div>
      <div className="col-span-1 text-left">
        {isPending && !opening_time ? (
          <div className="skeleton-shimmer h-5 rounded" />
        ) : (
          <p>{opening_time}</p>
        )}
      </div>
    </div>
  );
}
