import { Coffee } from 'lucide-react';

export default function EatenMenus({ eaten }: { eaten: string }) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex items-center gap-1">
        <Coffee className="size-4" />
        <span className="">먹은 메뉴</span>
      </div>
      <div className="text-md col-span-2">{eaten}</div>
    </div>
  );
}
