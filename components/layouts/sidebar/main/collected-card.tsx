import { useCheckStore } from 'utils/store';
import {
  OverThreeRatingStyle,
  OverFiveRatingStyle,
  RatingCircleStyle,
  getCollectedCardStyle,
  UniqueCardStyle,
  UniqueCardEffectStyle,
} from 'utils/styles';
import { CollectedCardProps } from 'types/common';
import Image from 'next/image';

export default function CollectedCard({
  name,
  photoUrl,
  address,
  phoneNum,
  ratings,
  onClick,
}: CollectedCardProps) {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);
  const isUnique = name === '탐앤탐스 대구강북점';

  const bgRatings =
    ratings >= 5
      ? OverFiveRatingStyle
      : ratings >= 3
        ? OverThreeRatingStyle
        : 'text-white bg-black';

  return (
    <div className="relative">
      {isUnique && <div className={UniqueCardEffectStyle}></div>}
      <div
        onClick={onClick}
        className={
          isUnique
            ? UniqueCardStyle
            : getCollectedCardStyle(bgRatings, isDarkTheme)
        }
      >
        <div className="shadow-md shadow-gray-500 px-2">
          <span className="">{name}</span>
        </div>
        <div className="flex justify-start gap-0.5">
          {Array(ratings)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={RatingCircleStyle}>
                <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
              </div>
            ))}
        </div>
        <div className="flex justify-center rounded-xl">
          <Image
            src={photoUrl}
            alt="카페 썸네일 이미지"
            width={100}
            height={50}
            className="w-auto h-auto"
          />
        </div>
        <div className="flex flex-col shadow-gray-500 shadow-md px-2">
          <span className="text-sm">{address}</span>
          <span>{phoneNum}</span>
        </div>
      </div>
    </div>
  );
}
