export default function ProsGrid({ pros }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1">
        <i className="fa-regular fa-face-smile pt-1"></i>
        <span>좋은 점</span>
      </div>
      <div className="col-span-2 text-md">{pros}</div>
    </div>
  );
}
