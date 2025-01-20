import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';

interface ProsGridProps {
  pros: string;
}

export default function ProsGrid({ pros }: ProsGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1">
        <FontAwesomeIcon icon={faFaceSmile} className="pt-1" />
        <span className="font-dpixel">좋은 점</span>
      </div>
      <div className="col-span-2 text-md">{pros}</div>
    </div>
  );
}
