'use client';

import { useUIStore } from '@/stores';
import ImageWithFallback from '@/components/shared/ImageWithFallback';

interface ICafeItem {
  name: string | undefined;
  address: string;
  phone_number: string | null | undefined;
  image: string;
  onClickAction: () => void;
}

export default function CafeItem({
  name,
  address,
  phone_number,
  image,
  onClickAction
}: ICafeItem) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <li
      className={`h-24 p-2 rounded-sm shadow-md list-none ${isDarkTheme ? 'bg-dark-background text-white shadow-dark-shadow' : ''} hover:opacity-50 transition duration-150 ease`}
    >
      <button
        type="button"
        aria-label="카페 상세 정보 열기 버튼"
        onClick={onClickAction}
        className="w-full h-full flex justify-between items-center gap-2 text-left"
      >
        <div className="h-full flex flex-col justify-center gap-1">
          <span className="whitespace-nowrap overflow-hidden text-ellipsis  font-bold text-xl">
            {name}
          </span>
          <div>
            <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {address}
            </p>
            <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {phone_number}
            </p>
          </div>
        </div>
        <div className="h-full flex items-center justify-center">
          <ImageWithFallback
            src={image}
            fallbackSrc='https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif'
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
