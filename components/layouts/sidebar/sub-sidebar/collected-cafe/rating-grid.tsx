import { RatingCircleStyle, RatingStarStyle } from 'utils/styles';
import { FaStar } from 'react-icons/fa6';

interface RatingGridProps {
  rating: number;
}

export default function RatingGrid({ rating }: RatingGridProps) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className={RatingCircleStyle}>
          <FaStar className={RatingStarStyle} />
        </div>
        <span className="font-dpixel">{rating}</span>
      </div>
    </span>
  );
}
