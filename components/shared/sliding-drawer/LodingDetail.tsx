'use client';

import { IoMdClock } from 'react-icons/io';
import { IoBookmark, IoLocation, IoCloseCircle } from 'react-icons/io5';
import { FaPhoneSquare } from 'react-icons/fa';
import { useUIStore } from '@/stores';
import Spinner from './Spinner';

export default function Loading() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={`p-2 shadow-md rounded-md ${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center`}>
        <div className="flex items-end">
          <IoBookmark
            className={`pr-2 text-3xl ${isDarkTheme ? 'text-white' : ''}`}
          />
          <span className="text-2xl font-semibold">로딩 중입니다</span>
          <span className="w-2 inline-block animate-[dotOne_1.5s_ease-in-out_infinite]">
            .
          </span>
          <span className="w-2 inline-block animate-[dotTwo_1.5s_ease-in-out_infinite]">
            .
          </span>
          <span className="w-2 inline-block animate-[dotThree_1.5s_ease-in-out_infinite]">
            .
          </span>
        </div>
        <div className="px-2 right-2">
          <IoCloseCircle className="text-main text-3xl hover:text-opacity-70" />
        </div>
      </div>

      <div className={`p-2 ${isDarkTheme ? 'shadow-main-shadow' : ''} flex flex-col gap-4 shadow-md rounded-md`}>
        <div className="flex flex-col items-center">
          <Spinner width="w-16" height="h-16" border="border-8" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-xl ">상세 정보</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <IoMdClock />
              <p className="">영업시간</p>
            </div>
            <div className="col-span-1 text-left"></div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center gap-1">
              <IoLocation />
              <p className="">위치</p>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <div className="hover:opacity-70"></div>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center gap-1">
              <FaPhoneSquare />
              <p className="">전화번호</p>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <div className="hover:opacity-70"></div>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg ">메뉴</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
