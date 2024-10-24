import { CommentGridProps } from 'types/types';

export default function CommentGrid({ comment }: CommentGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1">
        <i className="fa-solid fa-pen pt-1"></i>
        <span>내 코멘트</span>
      </div>
      <div className="col-span-2 text-md">{comment}</div>
    </div>
  );
}
