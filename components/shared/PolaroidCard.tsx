'use client';

import { CSSProperties, useState, memo } from 'react';
import { useUIStore } from '@/stores';
import Image from 'next/image';

export interface IPolaroidCard {
  imageUrl: string;
  rotation: number;
  position: { x: number; y: number; z: number };
  scale: number;
  index: number;
}

function PolaroidCard({
  imageUrl,
  rotation,
  position,
  scale,
  index,
}: IPolaroidCard) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const cardStyle: CSSProperties = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    zIndex: position.z,
    transform: `rotate(${rotation}deg) scale(${scale}) translate3d(0, 0, 0)`,
    transformOrigin: 'center center',
    animationDelay: `${index * 0.1}s`,
    willChange: 'transform, opacity',
    '--rotation': `${rotation}deg`,
  } as CSSProperties;

  const cardClassName = isDarkTheme ? 'polaroid-card-dark' : 'polaroid-card-light';
  const tapeClassName = isDarkTheme ? 'polaroid-tape-dark' : 'polaroid-tape-light';
  const imageContainerClassName = isDarkTheme ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <div
      className={`${cardClassName} w-[180px] sm:w-[220px] lg:w-[280px] animate-[polaroid-fall_0.8s_cubic-bezier(0.34,1.56,0.64,1)_both] opacity-40`}
      style={cardStyle}
    >
      {/* 테이프 장식 */}
      <div className={tapeClassName} />

      {/* 이미지 영역 */}
      <div className={`relative h-[160px] w-full overflow-hidden rounded-sm sm:h-[200px] lg:h-[240px] ${imageContainerClassName}`}>
        <Image
          src={imageUrl}
          alt="Cafe polaroid"
          fill
          sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 280px"
          className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          quality={50}
          priority={index < 4}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-300 to-gray-400" />
        )}
      </div>

      {/* 하단 여백 */}
      <div className="h-[60px] sm:h-[70px] lg:h-[80px]" />
    </div>
  );
}

export default memo(PolaroidCard);
