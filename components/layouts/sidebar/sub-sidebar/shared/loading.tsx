import { useCheckStore } from 'utils/store';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoMdClock } from 'react-icons/io';
import { IoBookmark, IoLocation, IoCloseCircle } from 'react-icons/io5';
import { FaPhoneSquare } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa6';
import dynamic from 'next/dynamic';

const Spinner = dynamic(() => import('../../shared/spinner'), {
  ssr: false,
});
const Skeleton = dynamic(() => import('./skeleton'), {
  ssr: false,
});

export default function Loading() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          <IoBookmark
            className={`pr-2 text-3xl ${isDarkTheme ? 'text-white' : ''}`}
          />
          <p className="text-2xl font-semibold">로딩 중입니다...</p>
        </div>
        <div className="px-2 right-2">
          <IoCloseCircle className="text-main text-3xl hover:text-opacity-70" />
        </div>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <Spinner size="6" border="8" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-xl font-dpixel">상세 정보</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <IoMdClock />
              <p className="font-dpixel">영업시간</p>
            </div>
            <div className="col-span-1 text-left">
              <Skeleton width="w-[10rem]" height="h-[1rem]" />
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center gap-1">
              <IoLocation />
              <p className="font-dpixel">위치</p>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <Skeleton width="w-[10rem]" height="h-[1rem]" />
              <div className="hover:opacity-70">
                <FaCopy />
              </div>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex items-center gap-1">
              <FaPhoneSquare />
              <p className="font-dpixel">전화번호</p>
            </div>
            <div className="col-span-2 flex items-center gap-4">
              <Skeleton width="w-[10rem]" height="h-[1rem]" />
              <div className="hover:opacity-70">
                <FaCopy />
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-dpixel">메뉴</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
