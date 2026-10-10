'use client';

import { usePathname } from 'next/navigation';
import { createPolaroidLayout } from '@/utils/shared/polaroidLayout';
import { useUIStore } from '@/stores';
import PolaroidCard from '@/components/shared/PolaroidCard';

const SHOULD_BLUR_ROUTES = [
  '/main',
  '/search',
  '/collection',
  '/bookmark',
  '/recommendation',
  '/help',
];

const POLAROID_CARDS = createPolaroidLayout();

export default function PolaroidGalleryBackground() {
  const pathname = usePathname();

  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const backgroundClassName = isDarkTheme
    ? 'bg-gradient-to-br from-black via-gray-800 to-black'
    : 'bg-gradient-to-br from-main-light/5 via-white/30 to-main-light/10';

  const shouldBlur = SHOULD_BLUR_ROUTES.some(route =>
    pathname.startsWith(route),
  );

  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden ${shouldBlur ? 'blur-xs' : ''}`}
      aria-hidden="true"
    >
      {/* 배경 그라데이션 레이어 */}
      <div
        className={`absolute inset-0 ${backgroundClassName} transition-colors duration-500`}
      />

      {/* 폴라로이드 카드들 */}
      <div className="absolute inset-0">
        {POLAROID_CARDS.map((card, idx) => (
          <PolaroidCard
            key={card.id}
            imageUrl={card.imageUrl}
            rotation={card.rotation}
            position={card.position}
            scale={card.scale}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
