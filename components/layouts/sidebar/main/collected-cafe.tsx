import { useCheckStore } from 'utils/store';
import {
  OverThreeRatingStyle,
  OverFiveRatingStyle,
  RatingCircleStyle,
  getCollectedCardStyle,
  UniqueCardStyle,
  UniqueCardEffectStyle,
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

  const isUnique = name === '탐앤탐스 대구강북점';

  const bgRatings =
    ratings != null
      ? ratings >= 5
        ? OverFiveRatingStyle
        : ratings >= 3
          ? OverThreeRatingStyle
          : 'text-white bg-black'
      : 'text-white bg-black';

  return (
    <div data-cy="collected-cafe" className="relative">
      {isUnique && <div className={UniqueCardEffectStyle}></div>}
      <div
        onClick={onClick}
        className={
          isUnique
            ? UniqueCardStyle
            : getCollectedCardStyle(bgRatings, isDarkTheme)
        }
      >
        <div className="flex flex-col gap-2">
          <div className="shadow-md shadow-gray-500 px-2">
            <span className="font-dpixel">{name}</span>
          </div>
          <div className="flex justify-start gap-0.5">
            {Array(ratings)
              .fill(0)
              .map((_, index) => (
                <div key={index} className={RatingCircleStyle}>
                  <FaStar className="fa-solid fa-star absolute text-yellow-300 text-xs" />
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-center rounded-xl h-[7rem]">
          <Image
            src={photoUrl ?? '/image/cafe_thumbnail.webp'}
            alt="카페 썸네일"
            priority={true}
            width={100}
            height={50}
            className="object-cover w-auto h-full rounded-xl"
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
