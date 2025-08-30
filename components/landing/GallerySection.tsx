'use client';

import React, { useRef } from 'react';
import { Star, Coffee, Shield, Crown, Gem, Eye } from 'lucide-react';

interface ISampleCafe {
  name: string;
  address: string;
  phone_number: string;
  ratings: number;
  icon: React.ComponentType<{ className?: string }>;
}

const SAMPLE_CAFES: ISampleCafe[] = [
  {
    name: "노멀 카드",
    address: "울산광역시 중구 중앙로",
    phone_number: "052-1234-5678",
    ratings: 2,
    icon: Coffee,
  },
  {
    name: "실버 카드",
    address: "부산광역시 해운대구 해운대로",
    phone_number: "051-1234-5678",
    ratings: 3,
    icon: Shield,
  },
  {
    name: "골드 카드",
    address: "대구광역시 수성구 범어로",
    phone_number: "053-1234-5678",
    ratings: 4,
    icon: Crown,
  },
  {
    name: "에메랄드 카드",
    address: "서울특별시 강남구 테헤란로",
    phone_number: "02-1234-5678",
    ratings: 5,
    icon: Gem,
  },
  {
    name: "히든 카드",
    address: "경기 성남시 분당구 분당내곡로",
    phone_number: "031-1234-5678",
    ratings: 5,
    icon: Eye,
  }
];

const EdgeSquare = ({ edgeSquare, isHiddenCard }: { edgeSquare: 'tl' | 'tr' | 'bl' | 'br', isHiddenCard: boolean }) => {
  const getPositionClasses = () => {
    switch (edgeSquare) {
      case 'tl':
        return 'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2';
      case 'tr':
        return 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2';
      case 'bl':
        return 'absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2';
      case 'br':
        return 'absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2';
    }
  };

  return <div className={`${getPositionClasses()} size-1.5 ${isHiddenCard ? 'border-main-dark bg-main' : 'border-gray-600 bg-gray-500'} border`} />;
};

const SampleCard = ({ cafe }: { cafe: ISampleCafe }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const backEffectRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isHiddenCard = cafe.name === "히든 카드";
  const Icon = cafe.icon;

  let cardClasses = '';
  let backEffectClasses = '';
  let addressBackgroundClasses = '';
  let textColor = '';

  switch (cafe.ratings) {
    case 1:
    case 2:
      cardClasses = 'bg-gray-100 text-gray-600 border-gray-500 hover:border-gray-500';
      addressBackgroundClasses = 'bg-gray-100';
      textColor = 'text-gray-600';
      break;
    case 3:
      cardClasses = 'card-silver text-black border-gray-500 hover:border-silver-base';
      backEffectClasses = 'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-gray-500 blur-md opacity-0 group-hover:opacity-100 pointer-none';
      addressBackgroundClasses = 'bg-silver-address-background';
      textColor = 'text-black group-hover:text-silver-name';
      break;
    case 4:
      cardClasses = 'card-gold text-black border-gray-500 hover:border-gold-base';
      backEffectClasses = 'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-gold-effect-left via-gold-effect-mid to-gold-effect-right blur-md opacity-0 group-hover:opacity-100 pointer-none';
      addressBackgroundClasses = 'bg-gold-address-background';
      textColor = 'text-black group-hover:text-gold-name';
      break;
    case 5:
      if (isHiddenCard) {
        cardClasses = 'card-hidden text-white border-main hover:border-main-light';
        backEffectClasses = 'card-tilt opacity-0 group-hover:opacity-100 absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-hidden-effect-left via-hidden-effect-mid to-hidden-effect-right blur-md pointer-none';
        addressBackgroundClasses = 'bg-hidden-address-background';
        textColor = 'text-white';
      } else {
        cardClasses = 'card-emerald text-black border-gray-500 hover:border-emerald-base';
        backEffectClasses = 'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-emerald-effect-left via-emerald-effect-mid to-emerald-effect-right blur-md opacity-0 group-hover:opacity-100 pointer-none';
        addressBackgroundClasses = 'bg-emerald-address-background';
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
    <div className="group card-container relative h-80 w-56 flex-shrink-0">
      {/* 백라이트 레이어 */}
      {backEffectClasses && (
        <div ref={backEffectRef} className={backEffectClasses}></div>
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
        className={`card-tilt w-full h-full p-3 border-4 ${cardClasses} rounded-2xl flex flex-col justify-between drop-shadow-3xl cursor-pointer transition duration-300 ease`}
      >
        {/* 빛 반사 효과 */}
        {cafe.ratings >= 3 && (
          <div ref={overlayRef} className="card-overlay inset-0 rounded-2xl" />
        )}

        <div className="flex flex-col gap-2">
          {/* 카페 이름 */}
          <div>
            <p className={`whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2 ${textColor} font-dunggeunmo font-bold text-sm transition-all duration-300 ease-in-out`}>
              {cafe.name}
              {isHiddenCard && (
                <span className="inline-flex h-5 px-1.5 rounded-lg shadow-md bg-linear-to-r from-hidden-badge-left via-hidden-badge-mid to-hidden-badge-right bg-size-[200%_200%] animate-gradient items-center justify-center text-xs font-dunggeunmo text-white">
                  HIDDEN
                </span>
              )}
            </p>
          </div>

          {/* 별점 */}
          <div className="z-10 flex justify-start gap-0.5">
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
        <div className="z-10 h-32 bg-gray-700 rounded-lg flex flex-col">
          <div className={`h-28 w-full rounded-t-md flex items-center justify-center ${isHiddenCard
            ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600'
            : cafe.ratings === 5
              ? 'bg-gradient-to-br from-emerald-200 to-emerald-400'
              : cafe.ratings === 4
                ? 'bg-gradient-to-br from-yellow-200 to-yellow-400'
                : cafe.ratings === 3
                  ? 'bg-gradient-to-br from-gray-200 to-gray-400'
                  : 'bg-gradient-to-br from-orange-200 to-orange-400'
            }`}>
            <Icon className={`h-10 w-10 ${isHiddenCard
              ? 'text-purple-800'
              : cafe.ratings === 5
                ? 'text-emerald-800'
                : cafe.ratings === 4
                  ? 'text-yellow-800'
                  : cafe.ratings === 3
                    ? 'text-gray-800'
                    : 'text-orange-800'
              }`} />
          </div>
          <div className="h-4 w-full bg-white rounded-b-md flex items-center justify-center">
            <span className="text-xs text-black">CAFE MASTERS</span>
          </div>
        </div>

        {/* 주소와 전화번호 */}
        <div className={`relative z-10 px-2 py-1 rounded-md border-2 ${isHiddenCard ? 'border-main' : 'border-gray-500'} ${addressBackgroundClasses} flex flex-col`}>
          <EdgeSquare edgeSquare="tl" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="tr" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="bl" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="br" isHiddenCard={isHiddenCard} />

          <p className={`whitespace-nowrap overflow-hidden text-xs text-ellipsis font-medium ${isHiddenCard ? 'text-hidden-address-text' : ''}`}>
            {cafe.address}
          </p>
          <p className={`whitespace-nowrap overflow-hidden text-xs text-ellipsis font-medium ${isHiddenCard ? 'text-hidden-address-text' : ''}`}>
            {cafe.phone_number}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function GallerySection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-main/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            다양한 등급의 카페 카드를
            <br />
            <span className="bg-gradient-to-r from-main to-main-dark bg-clip-text text-transparent">
              수집해보세요
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            내가 매긴 별점대로 카드의 등급이 정해집니다
            <br />
            숨겨진 히든 카페도 찾아보세요!
          </p>
        </div>

        {/* 카드 갤러리 */}
        <div className="flex justify-center items-start gap-6 overflow-x-auto pb-12">
          {SAMPLE_CAFES.map((cafe, index) => (
            <SampleCard key={index} cafe={cafe} />
          ))}
        </div>

        {/* 등급 설명 */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">노멀</h3>
              <p className="text-sm text-gray-600">1-2점 </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">실버</h3>
              <p className="text-sm text-gray-600">3점 </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">골드</h3>
              <p className="text-sm text-gray-600">4점 </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Gem className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">에메랄드</h3>
              <p className="text-sm text-gray-600">5점 </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-1">히든</h3>
              <p className="text-sm text-gray-600">특별한 카페</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}