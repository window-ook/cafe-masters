'use client';

import React, { useState, useRef } from 'react';
import { Sticker, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import '@/app/card-styles.css';

interface ISampleCard {
  id: number;
  title: string;
  stars: number;
  description1: string;
  description2: string;
  gradient: string;
  iconColor: string;
}

const SAMPLE_CARDS: ISampleCard[] = [
  {
    id: 1,
    title: '반갑습니다 사용자님!',
    stars: 5,
    description1: '카드를 많이 수집해서',
    description2: '카페 마스터가 되세요!',
    gradient: 'from-[#B5582D] via-[#C28D65] to-[#C59066]',
    iconColor: 'text-orange-800',
  },
  {
    id: 2,
    title: '다양한 카페를 탐험하세요!',
    stars: 5,
    description1: '숨겨진 카페들을',
    description2: '발견해보세요!',
    gradient: 'from-emerald-600 via-emerald-400 to-emerald-500',
    iconColor: 'text-emerald-900',
  },
  {
    id: 3,
    title: '친구들과 함께 즐기세요!',
    stars: 5,
    description1: '북마크를 공유하고',
    description2: '추천을 나누세요!',
    gradient: 'from-purple-600 via-purple-400 to-purple-500',
    iconColor: 'text-purple-900',
  },
];

const getCardStyles = (position: string) => {
  const baseClasses =
    'absolute top-0 w-full h-full transition-all duration-500 ease-in-out';

  switch (position) {
    case 'center':
      return `${baseClasses} left-0 opacity-100 scale-100 z-20`;
    case 'left':
      return `${baseClasses} -left-24 opacity-30 scale-75 z-10`;
    case 'right':
      return `${baseClasses} left-24 opacity-30 scale-75 z-10`;
    default:
      return `${baseClasses} opacity-0 scale-50 z-0`;
  }
};

export default function SampleCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = (e: React.MouseEvent) => {
    const container = cardRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * -30;
    const rotateX = (y / rect.height - 0.5) * 30;

    container.style.setProperty('--rotate-x', `${rotateX}deg`);
    container.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleCardMouseLeave = () => {
    const container = cardRef.current;
    if (!container) return;

    container.style.setProperty('--rotate-x', `0deg`);
    container.style.setProperty('--rotate-y', `0deg`);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? SAMPLE_CARDS.length - 1 : prevIndex - 1,
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prevIndex =>
      prevIndex === SAMPLE_CARDS.length - 1 ? 0 : prevIndex + 1,
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getCardPosition = (index: number) => {
    const diff =
      (index - currentIndex + SAMPLE_CARDS.length) % SAMPLE_CARDS.length;

    if (diff === 0) return 'center';
    if (diff === 1 || diff === -(SAMPLE_CARDS.length - 1)) return 'right';
    if (diff === SAMPLE_CARDS.length - 1 || diff === -1) return 'left';
    return 'hidden';
  };

  return (
    <div className="relative mx-auto flex h-96 w-full max-w-md items-center justify-center">
      {/* 좌측 화살표 */}
      <button
        onClick={goToPrevious}
        disabled={isAnimating}
        className="absolute top-1/2 left-0 z-30 -translate-y-1/2 cursor-pointer rounded-full border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="text-main size-6" />
      </button>

      {/* 카드 컨테이너 */}
      <div className="relative h-80 w-72">
        {SAMPLE_CARDS.map((card, index) => {
          const position = getCardPosition(index);
          const isCenter = position === 'center';

          return (
            <div
              key={card.id}
              className={`${getCardStyles(position)} card-container`}
            >
              <div
                ref={isCenter ? cardRef : null}
                onMouseMove={isCenter ? handleCardMouseMove : undefined}
                onMouseLeave={isCenter ? handleCardMouseLeave : undefined}
                className={`${isCenter ? 'card-tilt' : ''} card-sample drop-shadow-3xl h-full w-full rounded-2xl border-6 bg-gradient-to-br p-4 ${card.gradient} flex cursor-pointer flex-col justify-between border-gray-500`}
              >
                <div className="flex flex-col gap-2">
                  {/* 카페 이름 */}
                  <p className="font-dunggeunmo overflow-hidden px-2 py-1 text-left text-lg font-bold text-ellipsis whitespace-nowrap text-white shadow-sm">
                    {card.title}
                  </p>
                  {/* 별점 */}
                  <div className="flex justify-end gap-0.5">
                    {Array(card.stars)
                      .fill(0)
                      .map((_, starIndex) => (
                        <div key={starIndex} className="rating-red-circle">
                          <Heart className="fill-rating-star text-rating-star size-3" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* 썸네일 */}
                <div className="z-10 flex h-24 flex-col rounded-lg bg-gray-700">
                  <div className="flex h-40 w-full items-center justify-center rounded-t-md bg-gradient-to-br from-orange-200 to-orange-400">
                    <Sticker className={`size-12 ${card.iconColor}`} />
                  </div>
                  <div className="flex h-4 w-full items-center justify-center rounded-b-md bg-gray-200">
                    <span className="text-xs text-black">CAFE MASTERS</span>
                  </div>
                </div>

                {/* 디스크립션 */}
                <div className="relative z-10 flex flex-col rounded-md border-[0.125rem] border-gray-500 bg-[#E8CEB7] px-2">
                  <div className="absolute top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 border border-gray-600 bg-gray-500" />
                  <div className="absolute top-0 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 border border-gray-600 bg-gray-500" />
                  <div className="absolute bottom-0 left-0 size-1.5 -translate-x-1/2 translate-y-1/2 border border-gray-600 bg-gray-500" />
                  <div className="absolute right-0 bottom-0 size-1.5 translate-x-1/2 translate-y-1/2 border border-gray-600 bg-gray-500" />
                  <p className="text-text-primary overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                    {card.description1}
                  </p>
                  <p className="text-text-primary overflow-hidden font-medium text-ellipsis whitespace-nowrap">
                    {card.description2}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 우측 화살표 */}
      <button
        onClick={goToNext}
        disabled={isAnimating}
        className="absolute top-1/2 right-0 z-30 -translate-y-1/2 cursor-pointer rounded-full border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="text-main size-6" />
      </button>
    </div>
  );
}
