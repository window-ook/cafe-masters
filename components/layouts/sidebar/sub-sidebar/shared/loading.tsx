import { useCheckStore } from 'utils/store';
import {
  getDetailBodyStyle,
  DetailCollectButtonStyle,
  getDetailHeaderStyle,
  SubsidebarCloseIconStyle,
} from 'utils/styles';
import { IoMdClock } from 'react-icons/io';
import { IoBookmark, IoLocation, IoCloseCircle } from 'react-icons/io5';
import { FaPhoneSquare, FaChevronDown } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa6';

import Image from 'next/image';
import Tooltip from 'components/shared/tooltip';

export default function Loading() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          <IoBookmark
            className={`pr-2 text-3xl ${isDarkTheme ? 'text-white' : ''}`}
          />
          <span className="text-2xl font-semibold">로딩 중입니다...</span>
        </div>
        <div className="px-2 right-2">
          <IoCloseCircle className={SubsidebarCloseIconStyle} />
        </div>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <Image
            src={'/image/cafe_thumbnail.avif'}
            alt="카페 썸네일"
            width={160}
            height={240}
            className="w-[20rem] h-full rounded-md object-cover transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
            priority={true}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-xl font-dpixel">상세 정보</span>
          </div>
          <div aria-label="수집하기 버튼" className={DetailCollectButtonStyle}>
            수집하기
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <IoMdClock />
              <span className="font-dpixel">영업시간</span>
            </div>
            <div className="col-span-1 text-left">
              <span>??:?? ~ ??:??</span>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center gap-1">
              <IoLocation />
              <span className="font-dpixel">위치</span>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <span className="text-sm">?? ??구 ??로</span>
              <Tooltip
                comment="복사"
                component={
                  <div className="hover:opacity-70">
                    <FaCopy />
                  </div>
                }
                left="16"
              />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center gap-1">
              <FaPhoneSquare />
              <span className="font-dpixel">전화번호</span>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <span className="text-lg">???-????-????</span>
              <Tooltip
                comment="복사"
                component={
                  <div className="hover:opacity-70">
                    <FaCopy />
                  </div>
                }
                left="16"
              />
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">메뉴</span>
                <div aria-label="메뉴 보기 버튼">
                  <FaChevronDown
                    className={`fa-solid fa-angle-down text-lg ${isDarkTheme ? 'text-white' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
