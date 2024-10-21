export default function ConceptGrid({ concept }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 pt-0.5">
        <i className="fa-solid fa-question"></i>
        <span className="text-sm">카페의 컨셉</span>
      </div>
      <div className="col-span-2 text-md">{concept}</div>
    </div>
  );
}
