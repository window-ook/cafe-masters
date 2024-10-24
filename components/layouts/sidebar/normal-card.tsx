import { useCheckStore } from 'utils/store';
import { getNormalCardStyle } from 'utils/styles';
import { Card } from '@mui/material';
import { NormalCardProps } from 'types/types';
import Image from 'next/image';

export default function NormalCard({
  name,
  address,
  phoneNum,
  onClick,
}: NormalCardProps) {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);

  return (
    <Card onClick={onClick} className={getNormalCardStyle(isDarkTheme)}>
      <span
        className={`px-2 py-1 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'}`}
      >
        {name}
      </span>
      <div className="flex justify-center">
        <Image
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/search_thumbnail.webp"
          alt="cafe_img"
          width={100}
          height={50}
        />
      </div>
      <div
        className={`flex flex-col px-2 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'}`}
      >
        <span className="text-sm">{address}</span>
        <span>{phoneNum}</span>
      </div>
    </Card>
  );
}
