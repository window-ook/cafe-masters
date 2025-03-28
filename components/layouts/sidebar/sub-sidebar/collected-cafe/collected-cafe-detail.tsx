import { useRouter } from 'next/navigation';
import { useCheckStore, useMapStore } from 'utils/store';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import OpenTimeGrid from '../shared/open-time-grid';
import LocationGrid from '../shared/location-grid';
import PhoneGrid from '../shared/phone-grid';
import Image from 'next/image';
import EatenGrid from './eaten-grid';
import ProsGrid from './pros-grid';
import ConsGrid from './cons-grid';
import CommentGrid from './comment-grid';
import RatingGrid from './rating-grid';
import CategoryGrid from './category-grid';

interface CafeDetailProps {
  setMemoOpen: (open: boolean) => void;
}

export default function CollectedCafeDetail({ setMemoOpen }: CafeDetailProps) {
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
          <Image
            src={collectedCafeDetail?.photoUrl ?? '/image/cafe_thumbnail.avif'}
            alt="카페 썸네일"
            className="rounded-md w-auto h-auto transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
            width={160}
            height={30}
            priority={true}
            onClick={() =>
              window.open(
                `http://place.map.kakao.com/${collectedCafeDetail?.id}`,
                '_blank',
              )
            }
          />
        </div>

        <div className="flex justify-between items-center">
          <RatingGrid rating={collectedCafeDetail?.rating ?? 0} />
          <button
            data-cy="update-button"
            type="button"
            className="px-3 py-2 bg-red-400 rounded-lg font-bold font-pretendard text-white hover:bg-opacity-70 transition duration-200 ease"
            onClick={() => setMemoOpen(true)}
          >
            수정하기
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <CategoryGrid category={parsedCategory ?? []} />
          <OpenTimeGrid openingHours={collectedCafeDetail?.openingHours} />
          <LocationGrid address={collectedCafeDetail?.address} />
          <PhoneGrid phoneNum={collectedCafeDetail?.phoneNum} />

          <div className="col-span-2 grid grid-cols-3">
            <div className="bg-gray-400 bg-opacity-40 h-0.5 col-span-3"></div>
          </div>
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-2 font-dpixel text-2xl">CARD SPEC</div>
          </div>

          <CommentGrid comment={collectedCafeDetail?.comment} />
          <ProsGrid pros={collectedCafeDetail?.pros ?? ''} />
          <ConsGrid cons={collectedCafeDetail?.cons ?? ''} />
          <EatenGrid eaten={collectedCafeDetail?.eaten ?? ''} />
        </div>
      </div>
    </div>
  );
}
