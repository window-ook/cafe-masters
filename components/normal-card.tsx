import { Card, Typography } from '@material-tailwind/react';

export default function NormalCard({
  name,
  address,
  phone,
  collected = false, // 수집한 카페는 속성 표시
}) {
  return (
    <Card className="h-50 p-4 flex flex-col gap-2 border-4 border-gray-700 drop-shadow-3xl cursor-pointer">
      <div>
        <Typography
          variant="h5"
          color="blue-gray"
          className="shadow-md shadow-gray-700 px-2"
        >
          {name}
        </Typography>
        {collected ? '✓' : ''}
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
        <Typography>{phone}</Typography>
      </div>
    </Card>
  );
}
