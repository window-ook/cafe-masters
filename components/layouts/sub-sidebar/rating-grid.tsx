import { getRatingCircleStyle, getRatingStarStyle } from 'utils/styles';

interface RatingGridProps {
  rating: number;
}

export default function RatingGrid({ rating }: RatingGridProps) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className={getRatingCircleStyle()}>
          <i className={getRatingStarStyle()}></i>
        </div>
        {rating}
      </div>
    </span>
  );
}
