import { Star } from 'lucide-react';

export default function Ratings({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-xl">
      <div className="flex items-center justify-start gap-1">
        <div className="rating-red-circle">
          <Star className="fill-rating-star text-rating-star size-3" />
        </div>
        <span>{rating}</span>
      </div>
    </span>
  );
}
