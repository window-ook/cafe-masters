import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

interface CommentGridProps {
  comment: string;
}

export default function CommentGrid({ comment }: CommentGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1">
        <FontAwesomeIcon icon={faPen} className="pt-1" />
        <span className="font-dpixel">코멘트</span>
      </div>
      <div className="col-span-2 text-md">{comment}</div>
    </div>
  );
}
