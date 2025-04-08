import React, { useEffect, useRef } from 'react';
import { useCheckStore } from 'utils/store';
import { ratingCircleStyle } from 'utils/styles';
import { FaStar } from 'react-icons/fa6';
import Image from 'next/image';

interface CollectedCafeProps {
  name: string | undefined;
  address: string;
  phoneNum: string | null | undefined;
  photoUrl: string | null | undefined;
  ratings: number | null | undefined;
  onClick: () => void;
}

export default function CollectedCafe({
  name,
  photoUrl,
  address,
  phoneNum,
  ratings,
  onClick,
}: CollectedCafeProps) {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const cardRef = useRef<HTMLDivElement>(null);
  const backEffectRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLStyleElement | null>(null);

  const HIDDEN_CAFE_NAMES = ['탐앤탐스 대구강북점', '접속'];

  const HIDDEN_CARD =
    'card card-tilt h-full p-4 border-4 border-main rounded-2xl card-hidden flex flex-col justify-between text-white cursor-pointer hover:border-main-light transition duration-300 ease';

  const HIDDEN_CARD_BACK_EFFECT =
    'card-tilt opacity-0 group-hover:opacity-100 absolute -z-10 inset-0 w-[100%] h-[100%] rounded-xl bg-gradient-to-r from-hidden-effect-left via-hidden-effect-mid to-hidden-effect-right blur-md animate-tilt pointer-none';

  const RATING_ONE_N_TWO = 'bg-violet-50 text-gray-600';
  const RATING_THREE = 'card-silver text-black';
  const RATING_FOUR = 'card-gold text-black';
  const RATING_FIVE = 'card-emerald text-black';

  let COLOR_BY_RATING = '';
  let HOVER_BORDER_BY_RATING = '';
  let NORMAL_CARD_BACK_EFFECT = '';

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
        'card-tilt absolute -z-10 inset-0 w-[100%] h-[100%] rounded-xl bg-gray-500 blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      break;
    case 4:
      COLOR_BY_RATING = RATING_FOUR;
      HOVER_BORDER_BY_RATING = 'hover:border-gold-base';
      NORMAL_CARD_BACK_EFFECT =
        'card-tilt absolute -z-10 inset-0 w-[100%] h-[100%] rounded-xl bg-gradient-to-r from-gold-effect-left via-gold-effect-mid to-gold-effect-right blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
      break;
    case 5:
      COLOR_BY_RATING = RATING_FIVE;
      HOVER_BORDER_BY_RATING = 'hover:border-emerald-base';
      NORMAL_CARD_BACK_EFFECT =
        'card-tilt absolute -z-10 inset-0 w-[100%] h-[100%] rounded-xl bg-gradient-to-r from-emerald-effect-left via-emerald-effect-mid to-emerald-effect-right blur-md animate-tilt opacity-0 group-hover:opacity-100 pointer-none';
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

    // 히든 카드 홀로 스타일
    if (isHiddenCard && sparkleRef.current) {
      const w = rect.width;
      const h = rect.height;

      // 마우스 위치
      const px = Math.abs(Math.floor((100 / w) * x) - 100);
      const py = Math.abs(Math.floor((100 / h) * y) - 100);
      const pa = 50 - px + (50 - py);

      // 그라데이션 / 배경 위치
      const lp = 50 + (px - 50) / 1.5;
      const tp = 50 + (py - 50) / 1.5;
      const px_spark = 50 + (px - 50) / 7;
      const py_spark = 50 + (py - 50) / 7;
      const p_opc = 20 + Math.abs(pa) * 1.5;

      // 홀로그래픽 움직임
      const style = `
        .hidden-card:before { background-position: ${lp}% ${tp}%; }
        .hidden-card:after { background-position: ${px_spark}% ${py_spark}%; opacity: ${p_opc / 100}; }
      `;

      sparkleRef.current.innerHTML = style;
    }

    // 유니크 카드 홀로 스타일

    // 4 ~ 5 카드 홀로 스타일
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
      data-cy="collected-cafe"
      className="group card-container relative list-none h-[24rem]"
    >
      {/* 백라이트 레이어 */}
      {isHiddenCard ? (
        <div ref={backEffectRef} className={HIDDEN_CARD_BACK_EFFECT}></div>
      ) : (
        <div ref={backEffectRef} className={NORMAL_CARD_BACK_EFFECT}></div>
      )}

      {/* 카드 레이어 */}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={onClick}
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
            : `card-tilt h-full p-4 border-4 ${COLOR_BY_RATING} ${HOVER_BORDER_BY_RATING} ${isDarkTheme ? 'border-main-shadow' : 'border-gray-600'} rounded-2xl flex flex-col justify-between drop-shadow-3xl cursor-pointer transition duration-300 ease`
        }
      >
        {(ratings || 0) >= 3 && (
          <div
            ref={overlayRef}
            className="card-overlay inset-0 rounded-2xl"
          ></div>
        )}

        <div className="flex flex-col gap-2">
          <div>
            <p
              className={`whitespace-nowrap overflow-hidden ${isHiddenCard ? '' : 'group-hover:text-main'} text-ellipsis font-pretendard font-extrabold text-lg`}
            >
              {name} {isHiddenCard && <span>[HIDDEN]</span>}
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

        <div className="h-[11rem] bg-gray-700 rounded-lg flex flex-col">
          <Image
            src={photoUrl ?? '/image/cafe_thumbnail.avif'}
            alt="카페 썸네일"
            priority={true}
            width={100}
            height={50}
            className="object-cover h-[10rem] w-auto rounded-t-md"
          />
          <div className="h-[1rem] w-full bg-white rounded-b-md flex items-center justify-center">
            <span className="font-dpixel text-xs text-black">CAFE MASTERS</span>
          </div>
        </div>
        <div
          className={`px-2 rounded-md border-[0.1rem] ${isHiddenCard ? 'border-main' : 'border-gray-500'} flex flex-col`}
        >
          <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {address}
          </p>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis ">
            {phoneNum}
          </p>
        </div>
      </div>
    </li>
  );
}
