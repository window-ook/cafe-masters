import { ratingCircleStyle, ratingStarStyle } from 'utils/styles';
import { FaStar } from 'react-icons/fa6';

export default function Ratings({ rating }: { rating: number }) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className={ratingCircleStyle}>
          <FaStar className={ratingStarStyle} />
        </div>
        <span className="font-dpixel">{rating}</span>
      </div>
    </span>
  );
}
