'use client';

import React, { useRef, memo, useCallback } from 'react';
import { useUIStore } from '@/stores';
import { Star } from 'lucide-react';
import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import EdgeSquare from '@/components/shared/sidebar/EdgeSquare';
import { getHoloClass, getMaterialClass } from '@/utils/shared/material';
import '@/app/card-styles.css';

interface ICollectionCafe {
  name: string | undefined;
  address: string;
  phone_number: string | null;
  image: string | null;
  ratings: number | null;
  material: string | null;
  onClickAction: () => void;
}

const BACKLIGHT_BASE =
  'card-tilt opacity-0 group-hover:opacity-100 absolute -z-10 inset-0 w-full h-full rounded-xl blur-md animate-tilt pointer-none';

export default memo(function CollectionCafe({
  name,
  image,
  address,
  phone_number,
  ratings,
  material,
  onClickAction,
}: ICollectionCafe) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const cardRef = useRef<HTMLButtonElement>(null);
  const backEffectRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /** 재질이 없으면 미개봉 상태입니다. 위치를 얻지 못한 채 수집된 카드입니다 */
  const isUnopened = !material;

  /** 최고 등급인 흑요석은 모서리 장식을 강조합니다 */
  const isObsidian = material === 'obsidian';

  /** 재질(세상이 정하는 축)과 홀로그램(내가 정하는 축)을 각각 조합합니다 */
  const surfaceClass = isUnopened
    ? 'card-unopened'
    : `${getMaterialClass(material)} ${getHoloClass(ratings)}`;

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
    <li className="group card-container relative h-96 list-none">
      {/* 백라이트 레이어 - 재질의 대표색을 따릅니다 */}
      {!isUnopened && (
        <div
          ref={backEffectRef}
          className={`card-glow-${material} ${BACKLIGHT_BASE}`}
        ></div>
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
        className={`h-full w-full border-6 p-4 ${surfaceClass} ${isDarkTheme ? 'border-dark-border' : 'border-gray-500'} drop-shadow-3xl ease card-tilt flex cursor-pointer flex-col justify-between rounded-2xl transition duration-300`}
      >
        {/* 빛 반사 효과 - 홀로그램이 입혀진 카드에만 나타납니다 */}
        {!isUnopened && (ratings || 0) >= 3 && (
          <div ref={overlayRef} className="card-overlay inset-0 rounded-2xl" />
        )}

        <div className="flex flex-col gap-2">
          {/* 카페 이름 */}
          <div className="z-10 px-2 py-1 shadow-sm">
            <div className="font-dunggeunmo flex items-center justify-between text-lg font-bold transition-all duration-300 ease-in-out">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {name}
              </p>
              {isUnopened && (
                <span className="font-dunggeunmo ml-2 inline-flex h-6 items-center justify-center rounded-lg border border-gray-400 px-2 text-xs text-gray-300 shadow-md">
                  미개봉
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
        <div className="z-10 flex h-44 flex-col rounded-lg bg-gray-700">
          <Image
            src={image || IMAGE_PATHS.CAFE_THUMBNAIL_FALLBACK}
            alt="카페 썸네일"
            priority={true}
            width={100}
            height={50}
            className="h-40 w-auto rounded-t-md object-contain"
          />
          <div className="flex h-4 w-full items-center justify-center rounded-b-md bg-white">
            <span className="text-xs text-black">CAFE MASTERS</span>
          </div>
        </div>

        {/* 주소와 전화번호 */}
        <div
          className={`relative z-10 border-[0.125rem] border-gray-500 px-2 ${isUnopened ? 'bg-gray-800/60' : 'bg-white/75'} flex flex-col rounded-md`}
        >
          <EdgeSquare edgeSquare="tl" isHiddenCard={isObsidian} />
          <EdgeSquare edgeSquare="tr" isHiddenCard={isObsidian} />
          <EdgeSquare edgeSquare="bl" isHiddenCard={isObsidian} />
          <EdgeSquare edgeSquare="br" isHiddenCard={isObsidian} />

          <p
            className={`overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap ${isUnopened ? 'text-gray-300' : 'text-black'}`}
          >
            {address}
          </p>
          <p
            className={`overflow-hidden font-medium text-ellipsis whitespace-nowrap ${isUnopened ? 'text-gray-300' : 'text-black'}`}
          >
            {phone_number}
          </p>
        </div>
      </button>
    </li>
  );
});
