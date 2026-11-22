'use client';

import { useUIStore } from '@/stores';

interface ICafeItem {
  dataTestId: string;
  name: string | undefined;
  address: string;
  onClickAction: () => void;
}

export default function CafeItem({
  dataTestId,
  name,
  address,
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
          </div>
        </div>
      </button>
    </li>
  );
}
