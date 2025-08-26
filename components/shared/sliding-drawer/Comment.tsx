'use client';

import { MessageCircleMore } from 'lucide-react';

export default function Comment({ comment }: { comment: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <MessageCircleMore className="size-4" />
        <span className="">코멘트</span>
      </div>
      <div className="col-span-2 text-md">
        {comment}
      </div>
    </div>
  );
}