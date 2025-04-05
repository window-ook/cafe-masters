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
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const hiddenCardStyle =
    'h-full p-4 border-4 border-red-300 rounded-2xl bg-gradient-to-tl from-hidden-card-right via-hidden-card-mid to-hidden-card-left bg-[length:200%_200%] animate-gradient shadow-md drop-shadow-3xl text-white font-dpixel font-bold flex flex-col justify-between cursor-pointer card-tilt transition duration-300 ease';

  const hiddenCardBackEffectStyle =
    'absolute -z-10 inset-0 w-[100%] h-[100%] rounded-xl bg-gradient-to-r from-hidden-effect-left via-hidden-effect-mid to-hidden-effect-right blur-md animate-tilt card-tilt pointer-none';

  let bgRatings = '';
  const RATING_ONE = 'bg-neutral-50 shadow-md shadow-gray-300 text-black'; // 뉴트럴 50
  const RATING_TWO = 'bg-main-light shadow-md shadow-gray-300 text-gray-600'; // 메인 라이트
  const RATING_THREE = 'bg-silver-card shadow-md shadow-gray-300 text-gray-600'; // 실버
  const RATING_FOUR = 'bg-silver-card shadow-md shadow-gray-300 text-gray-600'; // 골드
  const RATING_FIVE = 'bg-gold-card shadow-md shadow-amber-700 text-black'; // 에메

  // 유니크는 총 3가지의 스타일 중 랜덤하게 발생 (RATING 3이상 준 카드 한정해서)

  switch (ratings) {
    case 1:
      bgRatings = RATING_ONE;
      break;
    case 2:
      bgRatings = RATING_TWO;
      break;
    case 3:
      bgRatings = RATING_THREE;
      break;
    case 4:
      bgRatings = RATING_FOUR;
      break;
    case 5:
      bgRatings = RATING_FIVE;
  }

  const HIDDEN_CAFE_NAMES = ['탐앤탐스 대구강북점', '접속'];

  const isHidden = () => {
    return HIDDEN_CAFE_NAMES.includes(name || '');
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 40;
    const rotateX = (y / rect.height - 0.5) * -40;

    container.style.setProperty('--rotate-x', `${rotateX}deg`);
    container.style.setProperty('--rotate-y', `${rotateY}deg`);

    back?.style.setProperty('--rotate-x', `${rotateX}deg`);
    back?.style.setProperty('--rotate-y', `${rotateY}deg`);

    if (isHidden() && styleRef.current) {
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

      // 홀로그래픽
      const style = `
        .hidden-card:before { background-position: ${lp}% ${tp}%; }
        .hidden-card:after { background-position: ${px_spark}% ${py_spark}%; opacity: ${p_opc / 100}; }
      `;

      styleRef.current.innerHTML = style;
    }
  };

  const handleCardMouseLeave = () => {
    const container = cardRef.current;
    const back = backEffectRef.current;

    if (!container) return;

    container.style.setProperty('--rotate-x', `0deg`);
    container.style.setProperty('--rotate-y', `0deg`);

    back?.style.setProperty('--rotate-x', `0deg`);
    back?.style.setProperty('--rotate-y', `0deg`);

    if (isHidden() && styleRef.current) styleRef.current.innerHTML = '';
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
    if (!styleRef.current) {
      const styleElement = document.createElement('style');
      document.head.appendChild(styleElement);
      styleRef.current = styleElement;
    }

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  return (
    <li
      data-cy="collected-cafe"
      className="relative list-none h-[24rem] card-container"
    >
      {isHidden() && (
        <div ref={backEffectRef} className={hiddenCardBackEffectStyle}></div>
      )}
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
          isHidden()
            ? `${hiddenCardStyle} hidden-card`
            : `h-full p-4 border-4 rounded-2xl flex flex-col justify-between drop-shadow-3xl card-tilt ${bgRatings} ${isDarkTheme ? 'border-main-shadow' : 'border-gray-600'} cursor-pointer transition duration-300 ease`
        }
      >
        <div
          ref={overlayRef}
          className="card-overlay inset-0 rounded-2xl"
        ></div>

        <div className="flex flex-col gap-2">
          <div>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis font-pretendard font-extrabold text-lg">
              {name}
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

        <div className="flex justify-center rounded-xl h-[10rem]">
          <Image
            src={photoUrl ?? '/image/cafe_thumbnail.avif'}
            alt="카페 썸네일"
            priority={true}
            width={100}
            height={50}
            className="object-cover w-auto h-full rounded-xl"
          />
        </div>
        <div className="px-2 rounded-md shadow-gray-500 shadow-md flex flex-col">
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
