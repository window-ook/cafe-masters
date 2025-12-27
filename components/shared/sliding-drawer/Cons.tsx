import { ThumbsDown } from 'lucide-react';

export default function Cons({ cons }: { cons: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex items-center gap-1">
        <ThumbsDown className="size-4" />
        <span className="">아쉬운 점</span>
      </div>
      <div className="text-md col-span-2">{cons}</div>
    </div>
  );
}
