export default function ReviewAndRatingGrid({ reviewCount, rating }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xl">리뷰 {reviewCount}</span>
      <span className="text-xl flex gap-1 items-center">
        <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
          <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
        </div>
        <span>{rating || ''}</span>
      </span>
    </div>
  );
}
