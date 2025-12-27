import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';

const SIZE_CLASSES = {
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '120px': 'text-[120px]',
} as const;

export default function Logo({
  size = '3xl',
}: {
  size?: '3xl' | '4xl' | '5xl' | '120px';
}) {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <header className="flex items-center">
      <Image
        src={IMAGE_PATHS.LOGO_IMG}
        width={32}
        height={32}
        alt="로고 아이콘"
        className="size-8"
      />
      <div className="flex items-center gap-1">
        <span
          className={`font-black ${sizeClass} logo-text-shadow leading-[0.9] text-white`}
        >
          CAFE
        </span>
        <span
          className={`font-black ${sizeClass} text-main logo-text-shadow leading-[0.9]`}
        >
          MASTERS
        </span>
      </div>
    </header>
  );
}
