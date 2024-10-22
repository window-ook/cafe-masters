import { useCheckStore } from 'utils/store';
import { Card } from '@mui/material';
import {
  getOverThreeRatingStyle,
  getOverFiveRatingStyle,
  getRatingStarsStyle,
  getCollectedCardStyle,
  getUniqueCardStyle,
  getUniqueCardEffectStyle,
} from 'utils/styles';

export default function CollectedCard({
  name,
  photoUrl,
  address,
  phone,
  ratings,
  onClick,
}) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const isUnique = name === '탐앤탐스 대구강북점';

  const bgRatings =
    ratings >= 5
      ? getOverFiveRatingStyle()
      : ratings >= 3
        ? getOverThreeRatingStyle()
        : 'text-white bg-black';

  return (
    <div className="relative">
      {isUnique && <div className={getUniqueCardEffectStyle()}></div>}
      <Card
        onClick={onClick}
        className={
          isUnique
            ? getUniqueCardStyle()
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
              <div key={index} className={getRatingStarsStyle()}>
                <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
              </div>
            ))}
        </div>
        <div className="flex justify-center rounded-xl">
          <img src={photoUrl} alt="cafe_img" className="h-20 rounded-lg" />
        </div>
        <div className="flex flex-col shadow-gray-500 shadow-md px-2">
          <span className="text-sm">{address}</span>
          <span>{phone}</span>
        </div>
      </Card>
    </div>
  );
}
