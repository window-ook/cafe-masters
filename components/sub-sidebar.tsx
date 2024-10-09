'use client';

import { Card } from '@material-tailwind/react';
import { useMapStore } from 'utils/store';

export default function SubSidebar({ isSubSidebarOpen, setIsSubSidebarOpen }) {
  const cafeDetail = useMapStore((state) => state.cafeDetail);

  return (
    <Card
      className={`h-[90vh] w-[100vw] max-w-[24rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 ${
        isSubSidebarOpen
          ? 'translate-x-[2rem] opacity-100'
          : 'translate-x-0 opacity-0'
      } z-10`}
    >
      {isSubSidebarOpen && (
        <div className="flex flex-col p-2">
          <h2 className="text-xl font-semibold">
            {cafeDetail?.basicInfo?.placenamefull}
          </h2>
          <img
            src="/image/cafe_thumb.png"
            alt="카페 썸네일"
            className="w-[10rem]"
          />
          <button
            onClick={() => setIsSubSidebarOpen(false)}
            className="text-main text-2xl px-2 absolute right-2"
          >
            X
          </button>
          <div className="flex justify-between">
            <span>내 카드</span>
            <span>코멘트: </span>
          </div>
          <div className="flex">
            <span>리뷰수</span>
            <span> | </span>
            <span>별점</span>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span>
                위치: {cafeDetail?.basicInfo.address?.region?.fullname}
              </span>
            </div>
            <div className="flex">
              <span>전화번호: {cafeDetail?.basicInfo?.phonenum}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
