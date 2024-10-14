'use client';

import { useCheckStore } from 'utils/store';
import { Card } from '@mui/material';

export default function NormalCard({ name, address, phone, onClick }) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);

  return (
    <Card
      onClick={onClick}
      className={`h-50 p-4 border-4 ${isDarkTheme ? 'border-darkaccent bg-darkbg text-white shadow-mainShadow' : 'border-gray-700'} rounded-2xl shadow-md flex flex-col gap-2 cursor-pointer font-dpixel`}
    >
      <span
        className={`px-2 py-1 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : 'shadow-gray-700'}`}
      >
        {name}
      </span>
      <div className="flex justify-center">
        <img src="/image/cafe_thumb.webp" alt="cafe_img" className="h-20" />
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
