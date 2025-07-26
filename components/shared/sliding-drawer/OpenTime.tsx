import { IoMdClock } from 'react-icons/io';

interface OpenTimeGridProps {
  opening_time: string | null;
}

export default function OpenTime({ opening_time }: OpenTimeGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <IoMdClock />
        <p className="font-dpixel">영업시간</p>
      </div>
      <div className="col-span-1 text-left">
        <p>{opening_time}</p>
      </div>
    </div>
  );
}
