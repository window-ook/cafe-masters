export default function LocationGrid({ address }) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex gap-1">
        <i className="fa-solid fa-location-dot pt-1"></i>
        <span>위치</span>
      </div>
      <div className="col-span-2 text-sm">{address}</div>
    </div>
  );
}
