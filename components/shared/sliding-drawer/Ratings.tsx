import { Star } from 'lucide-react';

export default function Ratings({ rating }: { rating: number }) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className="rating-red-circle">
          <Star className="fill-rating-star text-rating-star size-3" />
        </div>
        <span>{rating}</span>
      </div>
    </span>
  );
}
