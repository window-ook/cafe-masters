'use client';

import { useCheckStore } from 'utils/store';
import { getNormalCardStyle } from 'utils/styles';
import { Card } from '@mui/material';
import Image from 'next/image';

export default function NormalCard({ name, address, phone, onClick }) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);

  return (
    <Card onClick={onClick} className={getNormalCardStyle(isDarkTheme)}>
      <span
        className={`px-2 py-1 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'}`}
      >
        {name}
      </span>
      <div className="flex justify-center">
        <Image
          src="/image/cafe_thumb.webp"
          alt="cafe_img"
          width={80}
          height={40}
        />
      </div>
      <div
        className={`flex flex-col px-2 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'}`}
      >
        <span className="text-sm">{address}</span>
        <span>{phone}</span>
      </div>
    </Card>
  );
}
