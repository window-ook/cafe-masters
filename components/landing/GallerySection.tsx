'use client';

import React, { useRef } from 'react';
import { useUIStore } from '@/stores';
import { Star, Coffee, Shield, Crown, Gem, Eye } from 'lucide-react';
import { m } from 'motion/react';
import EdgeSquare from '@/components/shared/sidebar/EdgeSquare';
import '@/app/card-styles.css';

interface ISampleCafe {
  name: string;
  address: string;
  phone_number: string;
  ratings: number;
  icon: React.ComponentType<{ className?: string }>;
}

const SAMPLE_CAFES: ISampleCafe[] = [
  {
    name: '노멀 카드',
    address: '울산광역시 중구 중앙로',
    phone_number: '052-1234-5678',
    ratings: 2,
    icon: Coffee,
  },
  {
    name: '실버 카드',
    address: '부산광역시 해운대구 해운대로',
    phone_number: '051-1234-5678',
    ratings: 3,
    icon: Shield,
  },
  {
    name: '골드 카드',
    address: '대구광역시 수성구 범어로',
    phone_number: '053-1234-5678',
    ratings: 4,
    icon: Crown,
  },
  {
    name: '에메랄드 카드',
    address: '서울특별시 강남구 압구정로',
    phone_number: '02-1234-5678',
    ratings: 5,
    icon: Gem,
  },
  {
    name: '히든 카드',
    address: '경기 성남시 분당구 분당내곡로',
    phone_number: '031-1234-5678',
    ratings: 5,
    icon: Eye,
  },
];

const SampleCard = ({ cafe }: { cafe: ISampleCafe }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const backEffectRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isHiddenCard = cafe.name === '히든 카드';
  const Icon = cafe.icon;

  let cardClasses = '';
  let backlightColorByGrade = '';
  let addressAndPhoneBackgroundColor = '';
  let textColor = '';

  switch (cafe.ratings) {
    case 1:
    case 2:
      cardClasses =
        'bg-gray-100 text-gray-600 border-gray-500 hover:border-gray-500';
      addressAndPhoneBackgroundColor = 'bg-gray-100';
      textColor = 'text-gray-600';
      break;
    case 3:
      cardClasses =
        'card-silver text-black border-gray-500 hover:border-silver-base';
      backlightColorByGrade =
        'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-gray-500 blur-md opacity-0 group-hover:opacity-100 pointer-none';
      addressAndPhoneBackgroundColor = 'bg-silver-address-background';
      textColor = 'text-black group-hover:text-silver-name';
      break;
    case 4:
      cardClasses =
        'card-gold text-black border-gray-500 hover:border-gold-base';
      backlightColorByGrade =
        'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-gold-effect-left via-gold-effect-mid to-gold-effect-right blur-md opacity-0 group-hover:opacity-100 pointer-none';
      addressAndPhoneBackgroundColor = 'bg-gold-address-background';
      textColor = 'text-black group-hover:text-gold-name';
      break;
    case 5:
      if (isHiddenCard) {
        cardClasses =
          'card-hidden text-gray-600 border-main hover:border-main-light';
        backlightColorByGrade =
          'card-tilt opacity-0 group-hover:opacity-100 absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-hidden-badge-left via-hidden-badge-mid to-hidden-badge-right blur-md pointer-none';
        addressAndPhoneBackgroundColor = 'bg-hidden-address-background';
        textColor = 'text-white/80';
      } else {
        cardClasses =
          'card-emerald text-black border-gray-500 hover:border-emerald-base';
        backlightColorByGrade =
          'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-emerald-effect-left via-emerald-effect-mid to-emerald-effect-right blur-md opacity-0 group-hover:opacity-100 pointer-none';
        addressAndPhoneBackgroundColor = 'bg-emerald-address-background';
        textColor = 'text-black group-hover:text-emerald-name';
      }
      break;
  }

  const handleCardMouseMove = (e: React.MouseEvent) => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * -20;
    const rotateX = (y / rect.height - 0.5) * 20;

    container.style.setProperty('--rotate-x', `${rotateX}deg`);
    container.style.setProperty('--rotate-y', `${rotateY}deg`);

    back?.style.setProperty('--rotate-x', `${rotateX}deg`);
    back?.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleCardMouseLeave = () => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    container.style.setProperty('--rotate-x', `0deg`);
    container.style.setProperty('--rotate-y', `0deg`);

    back?.style.setProperty('--rotate-x', `0deg`);
    back?.style.setProperty('--rotate-y', `0deg`);
  };

  const handleOverlayMouseMove = (e: React.MouseEvent) => {
    const container = cardRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const percentX = (x / width) * 100;
    const percentY = (y / height) * 100;
    overlay.style.setProperty('--mouse-x', `${percentX}%`);
    overlay.style.setProperty('--mouse-y', `${percentY}%`);
    overlay.style.opacity = '0.8';
  };

  const handleOverlayMouseLeave = () => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    overlay.style.setProperty('--mouse-x', `50%`);
    overlay.style.setProperty('--mouse-y', `50%`);
    overlay.style.opacity = '0';
  };

  return (
    <div className="group card-container relative h-70 w-63 flex-shrink-0">
      {/* 백라이트 레이어 */}
      {backlightColorByGrade && (
        <div ref={backEffectRef} className={backlightColorByGrade}></div>
      )}

      {/* 카드 표면 */}
      <div
        ref={cardRef}
        onMouseMove={e => {
          handleCardMouseMove(e);
          handleOverlayMouseMove(e);
        }}
        onMouseLeave={() => {
          handleCardMouseLeave();
          handleOverlayMouseLeave();
        }}
        className={`card-tilt h-full w-full border-4 p-3 ${cardClasses} drop-shadow-3xl ease flex cursor-pointer flex-col justify-between rounded-2xl transition duration-300`}
      >
        {/* 빛 반사 효과 */}
        {cafe.ratings >= 3 && (
          <div ref={overlayRef} className="card-overlay inset-0 rounded-2xl" />
        )}

        <div className="flex flex-col gap-2">
          {/* 카페 이름 */}
          <div className="px-2 py-1 shadow-sm">
            <div
              className={`flex items-center justify-between ${textColor} font-dunggeunmo text-sm font-bold transition-all duration-300 ease-in-out`}
            >
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {cafe.name}
              </p>
              {isHiddenCard && (
                <span className="from-hidden-badge-left via-hidden-badge-mid to-hidden-badge-right animate-gradient font-dunggeunmo ml-2 inline-flex h-5 items-center justify-center rounded-lg bg-linear-to-r bg-size-[200%_200%] px-1.5 text-xs text-gray-600 shadow-md">
                  H
                </span>
              )}
            </div>
          </div>

          {/* 별점 */}
          <div className="z-10 flex justify-end gap-0.5">
            {Array(cafe.ratings)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="rating-red-circle">
                  <Star className="fill-rating-star text-rating-star size-3" />
                </div>
              ))}
          </div>
        </div>

        {/* 일러스트 */}
        <div className="z-10 flex h-32 flex-col rounded-lg bg-gray-700">
          <div
            className={`flex h-28 w-full items-center justify-center rounded-t-md ${
              isHiddenCard
                ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600'
                : cafe.ratings === 5
                  ? 'bg-gradient-to-br from-emerald-200 to-emerald-400'
                  : cafe.ratings === 4
                    ? 'bg-gradient-to-br from-yellow-200 to-yellow-400'
                    : cafe.ratings === 3
                      ? 'bg-gradient-to-br from-gray-200 to-gray-400'
                      : 'bg-gradient-to-br from-orange-200 to-orange-400'
            }`}
          >
            <Icon
              className={`h-10 w-10 ${
                isHiddenCard
                  ? 'text-purple-800'
                  : cafe.ratings === 5
                    ? 'text-emerald-800'
                    : cafe.ratings === 4
                      ? 'text-yellow-800'
                      : cafe.ratings === 3
                        ? 'text-gray-800'
                        : 'text-orange-800'
              }`}
            />
          </div>
          <div className="flex h-4 w-full items-center justify-center rounded-b-md bg-gray-200">
            <span className="text-text-primary text-xs">CAFE MASTERS</span>
          </div>
        </div>

        {/* 주소와 전화번호 */}
        <div
          className={`relative z-10 rounded-md border-2 px-2 py-1 ${isHiddenCard ? 'border-main' : 'border-gray-500'} ${addressAndPhoneBackgroundColor} flex flex-col`}
        >
          <EdgeSquare edgeSquare="tl" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="tr" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="bl" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="br" isHiddenCard={isHiddenCard} />

          <p
            className={`overflow-hidden text-xs font-medium text-ellipsis whitespace-nowrap ${isHiddenCard ? 'text-hidden-address-text' : 'text-text-primary'}`}
          >
            {cafe.address}
          </p>
          <p
            className={`overflow-hidden text-xs font-medium text-ellipsis whitespace-nowrap ${isHiddenCard ? 'text-hidden-address-text' : 'text-text-primary'}`}
          >
            {cafe.phone_number}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function GallerySection() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <section className="relative overflow-hidden bg-transparent py-32">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* 섹션 헤더 */}
        <div className="mb-20 text-center">
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="landing-heading"
          >
            카드 컬렉션
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className={`landing-paragraph mx-auto mt-4 max-w-2xl ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
          >
            내가 매긴 별점대로 카드의 등급이 정해집니다.
            <br />
            숨겨진 히든 카페도 찾아보세요!
          </m.p>
        </div>

        {/* 카드 갤러리 */}
        <div className="flex flex-wrap justify-center gap-8 py-10">
          {SAMPLE_CAFES.map((cafe, index) => (
            <SampleCard key={index} cafe={cafe} />
          ))}
        </div>

        {/* 등급 설명 */}
        <div className="mt-20 text-center">
          <div className="mx-auto flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/30 bg-orange-900/50 backdrop-blur-sm">
                <Coffee className="size-6 text-orange-400" />
              </div>
              <h3
                className={`landing-title mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-600'}`}
              >
                노멀
              </h3>
              <p
                className={`text-sm ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                1-2점{' '}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gray-500/30 bg-gray-800/50 backdrop-blur-sm">
                <Shield className="text-text-primary size-6" />
              </div>
              <h3
                className={`landing-title mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-600'}`}
              >
                실버
              </h3>
              <p
                className={`text-sm ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                3점{' '}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-900/50 backdrop-blur-sm">
                <Crown className="size-6 text-yellow-400" />
              </div>
              <h3
                className={`landing-title mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-600'}`}
              >
                골드
              </h3>
              <p
                className={`text-sm ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                4점{' '}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-900/50 backdrop-blur-sm">
                <Gem className="size-6 text-emerald-400" />
              </div>
              <h3
                className={`landing-title mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-600'}`}
              >
                에메랄드
              </h3>
              <p
                className={`text-sm ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                4점{' '}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/30 bg-purple-900/50 backdrop-blur-sm">
                <Eye className="size-6 text-purple-400" />
              </div>
              <h3 className="mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold text-transparent">
                히든
              </h3>
              <p
                className={`text-sm ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                특별한 카페
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
