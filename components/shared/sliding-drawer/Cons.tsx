'use client';

import { FaRegThumbsDown } from 'react-icons/fa';

interface ConsGridProps {
  cons: string;
}

export default function Cons({ cons }: ConsGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <FaRegThumbsDown className="pt-1" />
        <span className="font-dpixel">아쉬운 점</span>
      </div>
      <div className="col-span-2 text-md">{cons}</div>
    </div>
  );
}
