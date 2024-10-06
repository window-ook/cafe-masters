import { Card, Typography } from '@material-tailwind/react';

export default function NormalCard({ name, address, phone, ratings }) {
  return (
    <Card className="h-40">
      <Typography variant="h5" color="blue-gray" className="">
        {name}
      </Typography>
      <div className="flex justify-center">
        <img
          src="https://cdn.gukjenews.com/news/photo/202404/2977498_3052518_4331.png"
          alt="cafe_img"
          width={100}
        />
      </div>
      <div className="flex justify-end">
        {Array(ratings)
          .fill(0)
          .map((_, index) => (
            <i key={index} className="fa-solid fa-star text-yellow-700"></i>
          ))}
      </div>
      <div className="flex flex-col">
        <Typography>{address}</Typography>
        <Typography>{phone}</Typography>
      </div>
    </Card>
  );
}
