import { IoMdClock } from 'react-icons/io';

interface OpenTimeGridProps {
  openingHours: string | undefined;
}

export default function OpenTimeGrid({ openingHours }: OpenTimeGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <IoMdClock />
        <p className="font-dpixel">영업시간</p>
      </div>
      <div className="col-span-1 text-left">
        <p>{openingHours}</p>
      </div>
    </div>
  );
}
