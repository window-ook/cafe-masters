import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
interface ConceptGridProps {
  concept: string;
}

export default function ConceptGrid({ concept }: ConceptGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 pt-0.5">
        <FontAwesomeIcon icon={faQuestion} />
        <span className="font-dpixel">카페 컨셉</span>
      </div>
      <div className="col-span-2 text-md">{concept}</div>
    </div>
  );
}
