'use client';

import { Card, Typography } from '@material-tailwind/react';

export default function BookmarkedCard({ name, address, phone, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="h-50 p-4 flex flex-col gap-2 border-4 border-gray-700 drop-shadow-3xl cursor-pointer"
    >
      <div>
        <Typography
          variant="h6"
          color="blue-gray"
          className="shadow-md shadow-gray-700 px-2"
        >
          {name}
        </Typography>
      </div>
      <div className="flex justify-center">
        <img src="/image/cafe_thumb.webp" alt="cafe_img" width={100} />
      </div>
      <div className="flex flex-col shadow-md px-2">
        <Typography className="text-sm">{address}</Typography>
        <Typography>{phone}</Typography>
      </div>
    </Card>
  );
}
