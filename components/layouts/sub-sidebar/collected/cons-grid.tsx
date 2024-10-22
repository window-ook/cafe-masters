export default function ConsGrid({ cons }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1">
        <i className="fa-regular fa-face-frown pt-1"></i>
        <span>별로인 점</span>
      </div>
      <div className="col-span-2 text-md">{cons}</div>
    </div>
  );
}
