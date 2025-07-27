'use client';

import { useUIStore } from '@/stores';
import Image from 'next/image';

interface ICafeItem {
  name: string | undefined;
  address: string;
  phone_number: string | null | undefined;
  image?: string | null | undefined;
  onClickAction: () => void;
}

export default function CafeItem({
  name,
  image,
  address,
  phone_number,
  onClickAction
}: ICafeItem) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <li
      data-cy="normal-cafe"
      className={`${isDarkTheme ? 'bg-main-dark text-white shadow-main-shadow' : ''} h-24 p-2 rounded-sm shadow-md list-none cursor-pointer hover:opacity-50 transition duration-150 ease`}
    >
      <button
        type="button"
        onClick={onClickAction}
        className="w-full h-full flex justify-between items-center text-left"
      >
        <div className="h-full flex flex-col justify-center gap-1">
          <span className="whitespace-nowrap overflow-hidden text-ellipsis  font-bold text-xl">
            {name}
          </span>
          <div>
            <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {address}
            </p>
            <p className="font-pretendard text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {phone_number}
            </p>
          </div>
        </div>
        <div className="h-full flex items-center justify-center">
          <Image
            src={image || '/image/cafe_thumbnail.avif'}
            alt="카페 썸네일"
            width={100}
            height={50}
            priority={true}
            className="object-cover w-auto h-16 rounded-lg"
          />
        </div>
      </button>
    </li>
  );
}
