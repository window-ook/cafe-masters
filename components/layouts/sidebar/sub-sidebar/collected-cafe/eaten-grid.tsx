import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';
interface EatenGridProps {
  eaten: string;
}

export default function EatenGrid({ eaten }: EatenGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 pt-0.5">
        <FontAwesomeIcon icon={faMugHot} />
        <span className="font-dpixel">먹은 메뉴</span>
      </div>
      <div className="col-span-2 text-md">{eaten}</div>
    </div>
  );
}
