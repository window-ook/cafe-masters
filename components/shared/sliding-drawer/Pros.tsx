'use client';

import { FaRegThumbsUp } from 'react-icons/fa';

export default function Pros({ pros }: { pros: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <FaRegThumbsUp className="pt-1" />
        <span className="font-dpixel">좋은 점</span>
      </div>
      <div className="col-span-2 text-md">{pros}</div>
    </div>
  );
}
