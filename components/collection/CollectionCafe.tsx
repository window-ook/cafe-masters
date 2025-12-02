'use client';

import React, { useRef, memo, useCallback } from 'react';
import { useUIStore } from '@/stores';
import { Star } from 'lucide-react';
import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import EdgeSquare from '@/components/shared/sidebar/EdgeSquare';
import '@/app/card-styles.css';

interface ICollectionCafe {
  name: string | undefined;
  address: string;
  phone_number: string | null;
  image: string | null;
  ratings: number | null;
  onClickAction: () => void;
}

const HIDDEN_CAFE_NAMES = ['탐앤탐스 대구강북점', '접속'];

const HIDDEN_CARD = 'card-tilt w-full h-full p-4 border-6 border-main rounded-2xl card-hidden flex flex-col justify-between text-white cursor-pointer hover:border-main-light transition duration-300 ease';
const HIDDEN_CARD_BACK_EFFECT = 'card-tilt opacity-0 group-hover:opacity-100 absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-hidden-effect-left via-hidden-effect-mid to-hidden-effect-right blur-md animate-tilt pointer-none';

const RATING_ONE_N_TWO = 'bg-gray-100 text-gray-600';
const RATING_THREE = 'card-silver text-black';
const RATING_FOUR = 'card-gold text-black';
const RATING_FIVE = 'card-emerald text-black';

let cardColorByGrade = ''; // 등급에 따른 카드 색상
let borderColorByGrade = ''; // 등급에 따른 카드 보더 색상
let nameColorByGrade = ''; // 등급에 따른 카페 이름 색상
let backlightColorByGrade = ''; // 등급에 따른 백그라운드 효과
let addressAndPhoneBackgroundColor = ''; // 주소와 전화번호 배경 색상

export default memo(function CollectionCafe({
  name,
  image,
  address,
  phone_number,
  ratings,
  onClickAction,
}: ICollectionCafe) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const cardRef = useRef<HTMLButtonElement>(null);
  const backEffectRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  switch (ratings) {
    case 1:
    case 2:
      cardColorByGrade = RATING_ONE_N_TWO;
      backlightColorByGrade = '';
      nameColorByGrade = '';
      borderColorByGrade = 'hover:border-gray-500';
      addressAndPhoneBackgroundColor = 'bg-gray-100';
      break;
    case 3:
      cardColorByGrade = RATING_THREE;
      nameColorByGrade = 'group-hover:text-silver-name';
      borderColorByGrade = 'hover:border-silver-base';
      backlightColorByGrade = 'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-gray-500 blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      addressAndPhoneBackgroundColor = 'bg-silver-address-background';
      break;
    case 4:
      cardColorByGrade = RATING_FOUR;
      nameColorByGrade = 'group-hover:text-gold-name';
      borderColorByGrade = 'hover:border-gold-base';
      backlightColorByGrade = 'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-gold-effect-left via-gold-effect-mid to-gold-effect-right blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      addressAndPhoneBackgroundColor = 'bg-gold-address-background';
      break;
    case 5:
      cardColorByGrade = RATING_FIVE;
      nameColorByGrade = 'group-hover:text-emerald-name';
      borderColorByGrade = 'hover:border-emerald-base';
      backlightColorByGrade = 'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-emerald-effect-left via-emerald-effect-mid to-emerald-effect-right blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      addressAndPhoneBackgroundColor = 'bg-emerald-address-background';
      break;
  }

  const isHiddenCard = HIDDEN_CAFE_NAMES.includes(name || '');

  const handleCardMouseMove = useCallback((e: React.MouseEvent) => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * -40;
    const rotateX = (y / rect.height - 0.5) * 40;

    container.style.setProperty('--rotate-x', `${rotateX}deg`);
    container.style.setProperty('--rotate-y', `${rotateY}deg`);

    back?.style.setProperty('--rotate-x', `${rotateX}deg`);
    back?.style.setProperty('--rotate-y', `${rotateY}deg`);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    container.style.setProperty('--rotate-x', `0deg`);
    container.style.setProperty('--rotate-y', `0deg`);

    back?.style.setProperty('--rotate-x', `0deg`);
    back?.style.setProperty('--rotate-y', `0deg`);
  }, []);

  const handleOverlayMouseMove = useCallback((e: React.MouseEvent) => {
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
  }, []);

  const handleOverlayMouseLeave = useCallback(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    overlay.style.setProperty('--mouse-x', `50%`);
    overlay.style.setProperty('--mouse-y', `50%`);
    overlay.style.opacity = '0';
  }, []);

  return (
    <li className="group card-container relative list-none h-96">
      {/* 백라이트 레이어 */}
      {
        isHiddenCard
          ? (<div ref={backEffectRef} className={HIDDEN_CARD_BACK_EFFECT}></div>)
          : backlightColorByGrade ? (<div ref={backEffectRef} className={backlightColorByGrade}></div>) : null
      }

      {/* 카드 표면 */}
      <button
        ref={cardRef}
        tabIndex={0}
        onClick={onClickAction}
        onMouseMove={e => {
          handleCardMouseMove(e);
          handleOverlayMouseMove(e);
        }}
        onMouseLeave={() => {
          handleCardMouseLeave();
          handleOverlayMouseLeave();
        }}
        className={isHiddenCard ? `${HIDDEN_CARD}` : `card-tilt w-full h-full p-4 border-6 ${cardColorByGrade} ${borderColorByGrade} ${isDarkTheme ? 'border-dark-border' : 'border-gray-500'} rounded-2xl flex flex-col justify-between drop-shadow-3xl cursor-pointer transition duration-300 ease`}
      >
        {/* 빛 반사 효과 */}
        {(ratings || 0) >= 3 && (<div ref={overlayRef} className="card-overlay inset-0 rounded-2xl" />)}

        <div className="flex flex-col gap-2">
          {/* 카페 이름 */}
          <div className='z-10 px-2 py-1 shadow-sm'>
            <div className={`flex justify-between items-center ${isHiddenCard ? '' : nameColorByGrade} font-dunggeunmo font-bold text-lg transition-all duration-300 ease-in-out`}>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                {name}
              </p>
              {isHiddenCard && (
                <span className="inline-flex h-6 px-2 rounded-lg shadow-md bg-linear-to-r from-hidden-badge-left via-hidden-badge-mid to-hidden-badge-right bg-size-[200%_200%] animate-gradient items-center justify-center text-sm font-dunggeunmo ml-2">
                  H
                </span>
              )}
            </div>
          </div>
          {/* 별점 */}
          <div className="z-10 flex justify-end gap-0.5">
            {Array(ratings)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="rating-red-circle">
                  <Star className="fill-rating-star text-rating-star size-3" />
                </div>
              ))}
          </div>
        </div>

        {/* 일러스트 */}
        <div className="z-10 h-44 bg-gray-700 rounded-lg flex flex-col">
          <Image
            src={image || IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK}
            alt="카페 썸네일"
            priority={true}
            width={100}
            height={50}
            className="h-40 w-auto object-contain rounded-t-md"
          />
          <div className="h-4 w-full bg-white rounded-b-md flex items-center justify-center">
            <span className=" text-xs text-black">CAFE MASTERS</span>
          </div>
        </div>

        {/* 주소와 전화번호 */}
        <div className={`relative z-10 px-2 rounded-md border-[0.125rem] ${isHiddenCard ? 'border-main bg-hidden-address-background' : 'border-gray-500'} ${addressAndPhoneBackgroundColor} flex flex-col`}>
          <EdgeSquare edgeSquare="tl" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="tr" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="bl" isHiddenCard={isHiddenCard} />
          <EdgeSquare edgeSquare="br" isHiddenCard={isHiddenCard} />

          <p className={`whitespace-nowrap overflow-hidden text-sm text-ellipsis font-medium ${isHiddenCard ? 'text-hidden-address-text' : ''}`}>
            {address}
          </p>
          <p className={`whitespace-nowrap overflow-hidden text-ellipsis font-medium ${isHiddenCard ? 'text-hidden-address-text' : ''}`}>
            {phone_number}
          </p>
        </div>
      </button>
    </li >
  );
});