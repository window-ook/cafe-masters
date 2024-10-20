import { useCheckStore } from 'utils/store';
import { Card } from '@mui/material';

export default function CollectedCard({
  name,
  photoUrl,
  address,
  phone,
  ratings,
  onClick,
}) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const bgRatings =
    ratings >= 5
      ? 'bg-gradient-to-tl from-gold-side via-gold-via to-gold-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700'
      : ratings >= 3
        ? 'bg-gradient-to-tl from-silver-side via-silver-via to-silver-side bg-[length:200%_200%] animate-gradient shadow-md text-gray-600 shadow-gray-300'
        : 'text-main';
  return (
    <Card
      onClick={onClick}
      className={`h-50 p-4 border-4 ${isDarkTheme ? 'border-mainShadow' : 'border-gray-600'} rounded-2xl flex flex-col gap-2 drop-shadow-3xl cursor-pointer font-dpixel ${bgRatings}`}
    >
      <div className="shadow-md shadow-gray-500 px-2">
        <span className="">{name}</span>
      </div>
      <div className="flex justify-start gap-0.5">
        {Array(ratings)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100"
            >
              <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
            </div>
          ))}
      </div>
      <div className="flex justify-center rounded-xl">
        <img src={photoUrl} alt="cafe_img" className="h-20 rounded-lg" />
      </div>
      <div className="flex flex-col shadow-gray-500 shadow-md px-2">
        <span className="text-sm">{address}</span>
        <span>{phone}</span>
      </div>
    </Card>
  );
}
