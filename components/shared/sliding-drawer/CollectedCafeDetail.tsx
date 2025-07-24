'use client';

import { useRouter } from 'next/navigation';
import { useCheckStore, useMapStore } from 'utils/store';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import Image from 'next/image';
import CategoryGrid from './Categories';
import Ratings from './Ratings';
import OpenTimeGrid from './OpenTime';
import Location from './Location';
import PhoneNumber from './PhoneNumber';
import Comment from './Comment';
import EatenMenus from './EatenMenus';
import Pros from './Pros';
import Cons from './Cons';

interface CafeDetailProps {
  setMemoOpenAction: (open: boolean) => void;
}

export default function CollectedCafeDetail({
  setMemoOpenAction,
}: CafeDetailProps) {
  const collectedCafeDetail = useMapStore(
    state => state.collectedCafeDetail[0],
  );

  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const setIsSubSidebarOpen = useCheckStore(state => state.setIsSubSidebarOpen);

  const router = useRouter();

  const parsedCategory: string[] = collectedCafeDetail?.category
    ? JSON.parse(collectedCafeDetail.category)
    : [];

  const handleSetIsSubSidebarOpen = () => {
    setIsSubSidebarOpen(false);
    router.push('/cafe/collected');
  };

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          <span className="text-[1.375rem] font-dpixel font-semibold">
            {collectedCafeDetail?.name}
          </span>
        </div>
        <button
          type="button"
          aria-label="수집한 카드 상세 정보 보기 취소 버튼"
          onClick={handleSetIsSubSidebarOpen}
          className="px-2 right-2"
        >
          <IoCloseCircle className="text-main text-3xl hover:text-opacity-70" />
        </button>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <a
            href={`http://place.map.kakao.com/${collectedCafeDetail?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transform duration-300 ease-out hover:opacity-30"
          >
            <Image
              src={
                collectedCafeDetail?.photoUrl ?? '/image/cafe_thumbnail.avif'
              }
              alt="카페 썸네일"
              className="rounded-md w-auto h-auto"
              width={160}
              height={30}
              priority={true}
            />
          </a>
        </div>

        <div className="flex justify-between items-center">
          <Ratings rating={collectedCafeDetail?.rating ?? 0} />
          <button
            type="button"
            data-cy="update-button"
            className="px-3 py-2 bg-red-400 rounded-lg font-bold font-pretendard text-white hover:bg-opacity-70 transition duration-200 ease"
            onClick={() => setMemoOpenAction(true)}
          >
            수정하기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <CategoryGrid category={parsedCategory ?? []} />
          <OpenTimeGrid openingHours={collectedCafeDetail?.openingHours} />
          <Location address={collectedCafeDetail?.address} />
          <PhoneNumber phoneNum={collectedCafeDetail?.phoneNum} />

          <div className="col-span-2 grid grid-cols-3">
            <div className="bg-gray-400 bg-opacity-40 h-0.5 col-span-3"></div>
          </div>
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-2 font-dpixel text-2xl">CARD SPEC</div>
          </div>

          <Comment comment={collectedCafeDetail?.comment} />
          <EatenMenus eaten={collectedCafeDetail?.eaten ?? ''} />
          <Pros pros={collectedCafeDetail?.pros ?? ''} />
          <Cons cons={collectedCafeDetail?.cons ?? ''} />
        </div>
      </div>
    </div>
  );
}
