'use client';

import { useUIStore } from '@/stores';
import { IMAGE_PATHS } from '@/lib/paths';
import ImageWithFallback from '@/components/shared/ImageWithFallback';

interface ICafeItem {
  dataTestId: string;
  name: string | undefined;
  address: string;
  phone_number: string | null | undefined;
  image: string;
  onClickAction: () => void;
}

export default function CafeItem({
  dataTestId,
  name,
  address,
  phone_number,
  image,
  onClickAction,
}: ICafeItem) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <li
      className={`h-24 list-none rounded-xl p-2 shadow-md ${isDarkTheme ? 'bg-dark-background shadow-dark-shadow text-white' : ''} ease hover:shadow-main-300 transition duration-200`}
    >
      <button
        type="button"
        aria-label="카페 상세 정보 열기 버튼"
        data-testid={dataTestId}
        onClick={onClickAction}
        className="flex h-full w-full cursor-pointer items-center justify-between gap-2 text-left"
      >
        <div className="flex h-full flex-col justify-center gap-1">
          <span className="overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
            {name}
          </span>
          <div>
            <p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
              {address}
            </p>
            <p className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
              {phone_number}
            </p>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <ImageWithFallback
            src={image}
            fallbackSrc={IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK}
            alt="카페 썸네일"
            width={100}
            height={50}
            priority={true}
            className="h-16 w-auto rounded-lg object-cover"
          />
        </div>
      </button>
    </li>
  );
}
