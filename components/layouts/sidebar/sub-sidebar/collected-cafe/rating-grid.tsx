import { RatingCircleStyle, RatingStarStyle } from 'utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface RatingGridProps {
  rating: number;
}

export default function RatingGrid({ rating }: RatingGridProps) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className={RatingCircleStyle}>
          <FontAwesomeIcon icon={faStar} className={RatingStarStyle} />
        </div>
        <span className="font-dpixel">{rating}</span>
      </div>
    </span>
  );
}
