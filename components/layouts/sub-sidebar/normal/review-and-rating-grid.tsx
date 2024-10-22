import { getRatingCircleStyle, getRatingStarStyle } from 'utils/styles';

export default function ReviewAndRatingGrid({ reviewCount, rating }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xl">리뷰 {reviewCount}</span>
      <span className="text-xl flex gap-1 items-center">
        <div className={getRatingCircleStyle()}>
          <i className={getRatingStarStyle()}></i>
        </div>
        <span>{rating || ''}</span>
      </span>
    </div>
  );
}
