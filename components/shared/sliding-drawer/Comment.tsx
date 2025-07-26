'use client';

import { FaPencilAlt } from 'react-icons/fa';

export default function Comment({ comment }: { comment: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <FaPencilAlt className="pt-1" />
        <span className="font-dpixel">코멘트</span>
      </div>
      <div data-cy="collected-comment" className="col-span-2 text-md">
        {comment}
      </div>
    </div>
  );
}