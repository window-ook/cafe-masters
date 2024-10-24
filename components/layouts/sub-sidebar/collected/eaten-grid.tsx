import { EatenGridProps } from 'types/types';

export default function EatenGrid({ eaten }: EatenGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 pt-0.5">
        <i className="fa-solid fa-mug-hot"></i>
        <span className="text-sm">먹어본 메뉴</span>
      </div>
      <div className="col-span-2 text-md">{eaten}</div>
    </div>
  );
}
