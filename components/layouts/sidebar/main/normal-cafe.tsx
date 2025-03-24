import { useCheckStore } from 'utils/store';
import Image from 'next/image';

interface NormalCafeProps {
  name: string | undefined;
  address: string;
  phoneNum: string | null | undefined;
  photoUrl?: string | null | undefined;
  onClick: () => void;
}

export default function NormalCafe({
  onClick,
  name,
  address,
  phoneNum,
  photoUrl,
}: NormalCafeProps) {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  return (
    <li
      data-cy="normal-cafe"
      onClick={onClick}
      className={`${isDarkTheme ? 'bg-main-dark text-white shadow-main-shadow' : ''} h-[6rem] p-2 rounded-sm shadow-md list-none flex justify-between items-center cursor-pointer hover:opacity-50 transition duration-150 ease`}
    >
      <div className="flex flex-col gap-1">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis font-dpixel font-bold text-xl">
          {name}
        </span>
        <div>
          <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {address}
          </p>
          <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {phoneNum}
          </p>
        </div>
      </div>
      <div className="h-[4rem] flex justify-center">
        <Image
          src={photoUrl || '/image/cafe_thumbnail.avif'}
          alt="카페 썸네일"
          width={100}
          height={50}
          priority={true}
          className="object-cover w-auto h-full rounded-lg"
        />
      </div>
    </li>
  );
}
