'use client';

import { MessageCircleMore } from 'lucide-react';

export default function Comment({ comment }: { comment: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex items-center gap-1">
        <MessageCircleMore className="size-4" />
        <span className="">코멘트</span>
      </div>
      <div className="text-md col-span-2">{comment}</div>
    </div>
  );
}
