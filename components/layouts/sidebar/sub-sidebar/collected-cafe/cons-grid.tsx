import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';

interface ConsGridProps {
  cons: string;
}

export default function ConsGrid({ cons }: ConsGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1">
        <FontAwesomeIcon icon={faFaceFrown} className="pt-1" />
        <span>별로인 점</span>
      </div>
      <div className="col-span-2 text-md">{cons}</div>
    </div>
  );
}
