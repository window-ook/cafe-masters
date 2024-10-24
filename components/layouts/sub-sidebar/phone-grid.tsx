interface PhoneNumGridProps {
  phoneNum: string | null | undefined;
}

export default function PhoneGrid({ phoneNum }: PhoneNumGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex gap-1">
        <i className="fa-solid fa-phone pt-1"></i>
        <span>전화번호</span>
      </div>
      <div className="col-span-2 text-lg">{phoneNum}</div>
    </div>
  );
}
