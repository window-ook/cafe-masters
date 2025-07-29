import { FaStar } from 'react-icons/fa6';

export default function Ratings({ rating }: { rating: number }) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className="rating-red-circle">
          <FaStar className="rating-yellow-star" />
        </div>
        <span className="">{rating}</span>
      </div>
    </span>
  );
}
