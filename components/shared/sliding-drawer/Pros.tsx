'use client';

import { ThumbsUp } from 'lucide-react';

export default function Pros({ pros }: { pros: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex items-center gap-1">
        <ThumbsUp className="size-4" />
        <span className="">좋은 점</span>
      </div>
      <div className="text-md col-span-2">{pros}</div>
    </div>
  );
}
