import { useCheckStore } from 'utils/store';
import { getNormalCardStyle } from 'utils/styles';
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
    <div
      data-cy="normal-cafe"
      onClick={onClick}
      className={getNormalCardStyle(isDarkTheme)}
    >
      <span
        className={`${isDarkTheme ? 'shadow-main-shadow' : 'shadow-gray-700'} px-2 py-1 shadow-md font-dpixel`}
      >
        {name}
      </span>
      <div className="h-[7rem] flex justify-center">
        <Image
          src={photoUrl || '/image/cafe_thumbnail.avif'}
          alt="카페 썸네일"
          width={100}
          height={50}
          priority={true}
          className="object-cover w-auto h-full rounded-xl"
        />
      </div>
      <div
        className={`${isDarkTheme ? 'shadow-main-shadow' : 'shadow-gray-700'} flex flex-col px-2 shadow-md`}
      >
        <span className="text-sm">{address}</span>
        <span>{phoneNum}</span>
      </div>
    </div>
  );
}
