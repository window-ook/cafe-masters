import { useCheckStore } from 'utils/store';

interface SearchResultProps {
  name: string | undefined;
  address: string;
  phoneNum: string | null | undefined;
  onClick: () => void;
}

export default function SearchResult({
  onClick,
  name,
  address,
  phoneNum,
}: SearchResultProps) {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  return (
    <li
      data-cy="search-result"
      onClick={onClick}
      className={`h-[6rem] w-full p-2 list-none ${isDarkTheme ? 'bg-main-dark text-white shadow-main-shadow' : ''} bg-gray-100 shadow-md rounded-sm flex flex-col justify-center gap-1 cursor-pointer hover:opacity-50 transition-all duration-150 ease`}
    >
      <div>
        <p className="whitespace-nowrap overflow-hidden text-ellipsis font-dpixel font-bold text-xl">
          {name}
        </p>
        <div></div>
      </div>

      <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {address}
      </p>
      <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {phoneNum}
      </p>
    </li>
  );
}
