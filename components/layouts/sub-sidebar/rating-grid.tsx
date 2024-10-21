export default function RatingGrid({ rating }) {
  return (
    <span className="text-xl flex gap-1 items-center">
      <div className="flex justify-start items-center gap-1">
        <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100">
          <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
        </div>
        {rating}
      </div>
    </span>
  );
}
