'use client';

import React, { useEffect, useRef } from 'react';
import { useUIStore } from '@/stores';
import { ratingCircleStyle } from '@/utils/styles';
import { FaStar } from 'react-icons/fa6';
import Image from 'next/image';

interface ICollectedCafe {
  name: string | undefined;
  address: string;
  phone_number: string | null;
  image: string | null;
  ratings: number | null;
  onClickAction: () => void;
}

const HIDDEN_CAFE_NAMES = ['탐앤탐스 대구강북점', '접속'];
const HIDDEN_CARD = 'card card-tilt w-full h-full p-4 border-4 border-main rounded-2xl card-hidden flex flex-col justify-between text-white cursor-pointer hover:border-main-light transition duration-300 ease';
const HIDDEN_CARD_BACK_EFFECT = 'card-tilt opacity-0 group-hover:opacity-100 absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-hidden-effect-left via-hidden-effect-mid to-hidden-effect-right blur-md animate-tilt pointer-none';
const RATING_ONE_N_TWO = 'bg-violet-50 text-gray-600';
const RATING_THREE = 'card-silver text-black';
const RATING_FOUR = 'card-gold text-black';
const RATING_FIVE = 'card-emerald text-black';

let COLOR_BY_RATING = '';
let HOVER_BORDER_BY_RATING = '';
let NORMAL_CARD_BACK_EFFECT = '';

export default function CollectedCafe({
  name,
  image,
  address,
  phone_number,
  ratings,
  onClickAction,
}: ICollectedCafe) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const cardRef = useRef<HTMLButtonElement>(null);
  const backEffectRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLStyleElement | null>(null);

  switch (ratings) {
    case 1:
      COLOR_BY_RATING = RATING_ONE_N_TWO;
      break;
    case 2:
      COLOR_BY_RATING = RATING_ONE_N_TWO;
      break;
    case 3:
      COLOR_BY_RATING = RATING_THREE;
      HOVER_BORDER_BY_RATING = 'hover:border-silver-base';
      NORMAL_CARD_BACK_EFFECT =
        'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-gray-500 blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      break;
    case 4:
      COLOR_BY_RATING = RATING_FOUR;
      HOVER_BORDER_BY_RATING = 'hover:border-gold-base';
      NORMAL_CARD_BACK_EFFECT =
        'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-gold-effect-left via-gold-effect-mid to-gold-effect-right blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      break;
    case 5:
      COLOR_BY_RATING = RATING_FIVE;
      HOVER_BORDER_BY_RATING = 'hover:border-emerald-base';
      NORMAL_CARD_BACK_EFFECT =
        'card-tilt absolute -z-10 inset-0 w-full h-full rounded-xl bg-linear-to-r from-emerald-effect-left via-emerald-effect-mid to-emerald-effect-right blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
  }

  const isHiddenCard = HIDDEN_CAFE_NAMES.includes(name || '');

  const handleCardMouseMove = (e: React.MouseEvent) => {
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
  };

  const handleCardMouseLeave = () => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    container.style.setProperty('--rotate-x', `0deg`);
    container.style.setProperty('--rotate-y', `0deg`);

    back?.style.setProperty('--rotate-x', `0deg`);
    back?.style.setProperty('--rotate-y', `0deg`);

    if (isHiddenCard && sparkleRef.current) sparkleRef.current.innerHTML = '';
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

  useEffect(() => {
    if (!sparkleRef.current) {
      const styleElement = document.createElement('style');
      document.head.appendChild(styleElement);
      sparkleRef.current = styleElement;
    }

    return () => {
      if (sparkleRef.current && sparkleRef.current.parentNode) {
        sparkleRef.current.parentNode.removeChild(sparkleRef.current);
        sparkleRef.current = null;
      }
    };
  }, []);

  return (
    <li
      className="group card-container relative list-none h-96"
    >
      {/* 백라이트 레이어 */}
      {isHiddenCard ? (
        <div ref={backEffectRef} className={HIDDEN_CARD_BACK_EFFECT}></div>
      ) : (
        <div ref={backEffectRef} className={NORMAL_CARD_BACK_EFFECT}></div>
      )}

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
        className={
          isHiddenCard
            ? `${HIDDEN_CARD} hidden-card`
            : `card-tilt w-full h-full p-4 border-4 ${COLOR_BY_RATING} ${HOVER_BORDER_BY_RATING} ${isDarkTheme ? 'border-main-shadow' : 'border-gray-600'} rounded-2xl flex flex-col justify-between drop-shadow-3xl cursor-pointer transition duration-300 ease`
        }
      >
        {/* 빛 반사 효과 */}
        {(ratings || 0) >= 3 && (
          <div ref={overlayRef} className="card-overlay inset-0 rounded-2xl" />
        )}

        <div className="flex flex-col gap-2">
          <div>
            <p
              className={`whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-4 ${isHiddenCard ? '' : 'group-hover:text-main group-hover:font-bold transition-all duration-300 ease-in-out'} font-pretendard font-extrabold text-lg`}
            >
              {name}{' '}
              {isHiddenCard && (
                <span className="inline-flex h-6 px-2 rounded-lg shadow-md bg-linear-to-r from-hidden-badge-left via-hidden-badge-mid to-hidden-badge-right bg-size-[200%_200%] animate-gradient items-center justify-center text-sm ">
                  HIDDEN
                </span>
              )}
            </p>
          </div>
          <div className="flex justify-start gap-0.5">
            {Array(ratings)
              .fill(0)
              .map((_, index) => (
                <div key={index} className={ratingCircleStyle}>
                  <FaStar className="fa-solid fa-star absolute text-yellow-300 text-xs" />
                </div>
              ))}
          </div>
        </div>

        <div className="h-44 bg-gray-700 rounded-lg flex flex-col">
          <Image
            src={image || 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif'}
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
        <div
          className={`px-2 rounded-md border-[0.1rem] ${isHiddenCard ? 'border-main' : 'border-gray-500'} group-hover:border-main flex flex-col`}
        >
          <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {address}
          </p>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis ">
            {phone_number}
          </p>
        </div>
      </button>
    </li>
  );
}