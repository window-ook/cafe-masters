'use client';

import { useUIStore } from '@/stores';

interface SearchResultProps {
  name: string | undefined;
  address: string;
  phoneNum: string | null | undefined;
  onClickAction: () => void;
}

export default function SearchResult({
  onClickAction,
  name,
  address,
  phoneNum,
}: SearchResultProps) {
  const { isDarkTheme } = useUIStore();

  return (
    <li
      data-cy="search-result"
      className={`h-24 w-full p-2 list-none ${isDarkTheme ? 'bg-main-dark text-white shadow-main-shadow' : ''} bg-gray-100 shadow-md rounded-sm cursor-pointer hover:opacity-50 transition-all duration-150 ease`}
    >
      <button
        type="button"
        onClick={onClickAction}
        className="w-full flex flex-col justify-center gap-1 text-left"
      >
        <p className="whitespace-nowrap overflow-hidden text-ellipsis font-dpixel font-bold text-xl">
          {name}
        </p>
        <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {address}
        </p>
        <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
          {phoneNum}
        </p>
      </button>
    </li>
  );
}
