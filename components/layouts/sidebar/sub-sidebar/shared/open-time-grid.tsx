import { IoMdClock } from 'react-icons/io';

interface OpenTimeGridProps {
  openingHours: string | undefined;
}

export default function OpenTimeGrid({ openingHours }: OpenTimeGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <IoMdClock />
        <span className="font-dpixel">영업시간</span>
      </div>
      <div className="col-span-1 text-left"></div>
      <div className="col-span-1 text-center">
        <span>{openingHours}</span>
      </div>
    </div>
  );
}
