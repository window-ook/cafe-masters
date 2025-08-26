import { Clock1 } from 'lucide-react';

interface IOpenTime {
  opening_time: string | null;
  isLoading?: boolean;
}

export default function OpenTime({ opening_time, isLoading = false }: IOpenTime) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <Clock1 className="size-4" />
        <p>영업시간</p>
      </div>
      <div className="col-span-1 text-left">
        {isLoading && !opening_time ? (
          <div className="h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        ) : (
          <p>{opening_time}</p>
        )}
      </div>
    </div>
  );
}