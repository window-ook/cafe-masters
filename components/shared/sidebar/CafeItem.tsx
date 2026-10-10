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
      className={`h-24 list-none rounded-lg border p-2 ${isDarkTheme ? 'border-paper-dark-edge bg-paper-dark text-white hover:border-main-700' : 'border-paper-edge bg-paper hover:border-main-300'} ease transition duration-200`}
    >
      <button
        type="button"
        aria-label="카페 상세 정보 열기 버튼"
        data-testid={dataTestId}
        onClick={onClickAction}
        className="flex h-full w-full cursor-pointer items-center justify-between gap-2 text-left"
      >
        <div className="flex h-full flex-col justify-center gap-1">
          <span className="overflow-hidden text-lg font-semibold text-ellipsis whitespace-nowrap">
            {name}
          </span>
          {/* 보조 정보는 더 눌러 카드와의 위계를 확보합니다 */}
          <div className={isDarkTheme ? 'text-gray-400' : 'text-gray-500'}>
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
