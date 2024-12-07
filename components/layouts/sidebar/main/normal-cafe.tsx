import { useCheckStore } from 'utils/store';
import { CheckStore } from 'types/store';
import { getNormalCardStyle } from 'utils/styles';
import Image from 'next/image';

interface NormalCafeProps {
  name: string | undefined;
  address: string;
  phoneNum: string | null | undefined;
  onClick: () => void;
}

export default function NormalCafe({
  name,
  address,
  phoneNum,
  onClick,
}: NormalCafeProps) {
  const isDarkTheme = useCheckStore((state: CheckStore) => state.isDarkTheme);

  return (
    <div onClick={onClick} className={getNormalCardStyle(isDarkTheme)}>
      <span
        className={`${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'} px-2 py-1 shadow-md`}
      >
        {name}
      </span>
      <div className="flex justify-center">
        <Image
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/search_thumbnail.webp"
          alt="카페 썸네일 이미지"
          width={100}
          height={50}
          className="w-auto h-auto"
        />
      </div>
      <div
        className={`${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'} flex flex-col px-2 shadow-md`}
      >
        <span className="text-sm">{address}</span>
        <span>{phoneNum}</span>
      </div>
    </div>
  );
}
