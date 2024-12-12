import { RatingCircleStyle, RatingStarStyle } from 'utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface ReviewAndRatingGridProps {
  reviewCount: number | null | undefined;
  rating: number | null | undefined;
}

export default function ReviewAndRatingGrid({
  reviewCount,
  rating,
}: ReviewAndRatingGridProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xl">리뷰 {reviewCount}</span>
      <span className="text-xl flex gap-1 items-center">
        <div className={RatingCircleStyle}>
          <FontAwesomeIcon icon={faStar} className={RatingStarStyle} />
        </div>
        <span>{rating || ''}</span>
      </span>
    </div>
  );
}
