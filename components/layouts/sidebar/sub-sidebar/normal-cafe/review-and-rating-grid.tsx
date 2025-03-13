import { RatingCircleStyle, RatingStarStyle } from 'utils/styles';
import { FaStar } from 'react-icons/fa';

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
      <span className="font-dpixel text-xl">리뷰 {reviewCount}</span>
      <span className="text-xl flex gap-1 items-center">
        <div className={RatingCircleStyle}>
          <FaStar className={RatingStarStyle} />
        </div>
        <span className="font-dpixel">{rating || ''}</span>
      </span>
    </div>
  );
}
