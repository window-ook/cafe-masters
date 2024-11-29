interface OpenTimeGridProps {
  openWeekly: string | null | undefined;
  openWeekend: string | null | undefined;
}

export default function OpenTimeGrid({
  openWeekly,
  openWeekend,
}: OpenTimeGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <i className="fa-solid fa-clock"></i>
        <span>영업시간</span>
      </div>
      <div className="col-span-1 text-left">
        <span>평일</span>
      </div>
      <div className="col-span-1 text-center ">
        <span>{openWeekly}</span>
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-1 text-left">
        <span>주말</span>
      </div>
      <div className="col-span-1 text-center">
        <span>{openWeekend}</span>
      </div>
    </div>
  );
}
