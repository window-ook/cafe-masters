import { Card, Typography } from '@material-tailwind/react';

export default function CollectedCard({ name, address, ratings }) {
  // 별 갯수에 따른 bg-color 적용시키기
  return (
    <Card
      className={`h-50 p-4 flex flex-col gap-2 border-4 border-gray-700 drop-shadow-3xl ${ratings >= 5 ? 'bg-success' : 'bg-white'} cursor-pointer`}
    >
      <div>
        <Typography
          variant="h5"
          color="blue-gray"
          className="shadow-md shadow-gray-700 px-2"
        >
          {name}
        </Typography>
      </div>
      <div className="flex justify-end gap-0.5">
        {Array(ratings)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-600"
            >
              <i className="fa-solid fa-star absolute text-yellow-700 text-xs"></i>
            </div>
          ))}
      </div>
      <div className="flex justify-center">
        <img
          src="https://cdn.gukjenews.com/news/photo/202404/2977498_3052518_4331.png"
          alt="cafe_img"
          width={100}
        />
      </div>
      <div className="flex flex-col shadow-md px-2">
        <Typography className="text-sm">{address}</Typography>
      </div>
    </Card>
  );
}
