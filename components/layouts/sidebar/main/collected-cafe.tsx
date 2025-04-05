import React, { useRef } from 'react';
import { useCheckStore } from 'utils/store';
import {
  overThreeRatingStyle,
  overFiveRatingStyle,
  uniqueCardStyle,
  uniqueCardEffectStyle,
  ratingCircleStyle,
} from 'utils/styles';
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

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = cardRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;

    const rotateY = (x / rect.width - 0.5) * 40;
    const rotateX = (y / rect.height - 0.5) * -40;

    container.style.setProperty('--rotate-x', `${rotateX}deg`);
    container.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    const container = cardRef.current;
    if (!container) return;

    container.style.setProperty('--rotate-x', `0deg`);
    container.style.setProperty('--rotate-y', `0deg`);
  };

  const hidden = ['탐앤탐스 대구강북점', '접속'];

  const isUnique = (name: string) => {
    if (hidden.includes(name)) return true;
  };

  const bgRatings =
    ratings != null
      ? ratings >= 5
        ? overFiveRatingStyle
        : ratings >= 3
          ? overThreeRatingStyle
          : 'text-white bg-black'
      : 'text-white bg-black';

  return (
    <li
      data-cy="collected-cafe"
      className="relative list-none h-[24rem] card-container"
    >
      {isUnique(name || '') && <div className={uniqueCardEffectStyle}></div>}
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={
          isUnique(name || '')
            ? uniqueCardStyle
            : `h-full p-4 border-4 rounded-2xl flex flex-col justify-between drop-shadow-3xl card-tilt ${bgRatings} ${isDarkTheme ? 'border-main-shadow' : 'border-gray-600'} cursor-pointer transition duration-300 ease`
        }
      >
        <div className="flex flex-col gap-2">
          <div>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis font-dpixel text-lg">
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
