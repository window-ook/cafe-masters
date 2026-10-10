'use client';

import React, { useRef, memo, useCallback, useEffect } from 'react';
import { useUIStore } from '@/stores';
import { Star } from 'lucide-react';
import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import EdgeSquare from '@/components/shared/sidebar/EdgeSquare';
import { getHoloClass, getMaterialClass } from '@/utils/shared/material';
import { formatCollectedDate } from '@/utils/shared/date';
import '@/app/card-styles.css';

interface ICollectionCafe {
  name: string | undefined;
  address: string;
  phone_number: string | null;
  image: string | null;
  ratings: number | null;
  material: string | null;
  /** 수집 시각. 카드 = 방문이므로 그 카페에 간 날입니다 */
  created_at: string;
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
  created_at,
  onClickAction,
}: ICollectionCafe) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const sleeveRef = useRef<HTMLDivElement>(null);
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

  /** 마지막 포인터 좌표. 프레임마다 한 번만 읽습니다 */
  const pointerRef = useRef({ clientX: 0, clientY: 0 });
  const frameRef = useRef<number | null>(null);

  /**
   * 기울기·반사·광원을 한 프레임에 함께 갱신합니다
   * @description getBoundingClientRect는 강제 레이아웃을 유발하므로
   * 프레임당 한 번만 호출하고 세 효과가 그 값을 공유합니다.
   */
  const applyPointer = useCallback(() => {
    frameRef.current = null;

    const sleeve = sleeveRef.current;

    if (!sleeve) return;

    const rect = sleeve.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const { clientX, clientY } = pointerRef.current;
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;

    sleeve.style.setProperty('--rotate-x', `${(ratioY - 0.5) * 40}deg`);
    sleeve.style.setProperty('--rotate-y', `${(ratioX - 0.5) * -40}deg`);

    /* 카드는 기울고 반사는 평면에서 미끄러집니다.
       이동폭을 회전보다 좁게 잡아야 두 표면이 다르다는 것이 움직임으로 드러납니다 */
    sleeve.style.setProperty('--sleeve-x', `${30 + ratioX * 40}%`);

    const back = backEffectRef.current;

    back?.style.setProperty('--rotate-x', `${(ratioY - 0.5) * 40}deg`);
    back?.style.setProperty('--rotate-y', `${(ratioX - 0.5) * -40}deg`);

    const overlay = overlayRef.current;

    if (!overlay) return;

    overlay.style.setProperty('--mouse-x', `${ratioX * 100}%`);
    overlay.style.setProperty('--mouse-y', `${ratioY * 100}%`);
    overlay.style.opacity = '0.8';
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      pointerRef.current = { clientX: e.clientX, clientY: e.clientY };

      /* 마우스 폴링은 화면 주사율보다 잦으므로 프레임당 한 번으로 묶습니다 */
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(applyPointer);
    },
    [applyPointer],
  );

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const sleeve = sleeveRef.current;
    const back = backEffectRef.current;
    const overlay = overlayRef.current;

    sleeve?.style.setProperty('--rotate-x', '0deg');
    sleeve?.style.setProperty('--rotate-y', '0deg');
    sleeve?.style.setProperty('--sleeve-x', '50%');

    back?.style.setProperty('--rotate-x', '0deg');
    back?.style.setProperty('--rotate-y', '0deg');

    if (!overlay) return;

    overlay.style.setProperty('--mouse-x', '50%');
    overlay.style.setProperty('--mouse-y', '50%');
    overlay.style.opacity = '0';
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
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

      {/* 슬리브 - 카드를 덮는 투명막. 기울기는 슬리브가 담당해 카드와 한 덩어리로 움직입니다 */}
      <div
        ref={sleeveRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`card-sleeve ${isDarkTheme ? '' : 'card-sleeve-light'} drop-shadow-3xl`}
      >
        {/* 카드 표면 */}
        <button
          tabIndex={0}
          onClick={onClickAction}
          className={`h-full w-full border-6 p-4 ${surfaceClass} ${isDarkTheme ? 'border-dark-border' : 'border-gray-500'} ease flex cursor-pointer flex-col justify-between rounded-2xl transition duration-300`}
        >
          {/* 빛 반사 효과 - 홀로그램이 입혀진 카드에만 나타납니다 */}
          {!isUnopened && (ratings || 0) >= 3 && (
            <div
              ref={overlayRef}
              className="card-overlay inset-0 rounded-2xl"
            />
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
            {/* 획득일 - 흰 띠는 어느 재질에서나 같은 형태로 남고, 같은 카페 카드끼리는 날짜로 구분됩니다 */}
            <div className="flex h-4 w-full items-center justify-center rounded-b-md bg-white">
              <time dateTime={created_at} className="text-xs text-black">
                {formatCollectedDate(created_at)}
              </time>
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
      </div>
    </li>
  );
});
