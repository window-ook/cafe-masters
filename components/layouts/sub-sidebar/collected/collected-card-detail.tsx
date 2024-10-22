import { useCheckStore, useMapStore } from 'utils/store';
import {
  getDetailBodyStyle,
  getDetailCollectButtonStyle,
  getDetailHeaderStyle,
  getSubsidebarCloseIconStyle,
} from 'utils/styles';
import { Button } from '@mui/material';
import OpenTimeGrid from '../open-time-grid';
import LocationGrid from '../location-grid';
import PhoneGrid from '../phone-grid';
import Image from 'next/image';
import ConceptGrid from './concept-grid';
import EatenGrid from './eaten-grid';
import ProsGrid from './pros-grid';
import ConsGrid from './cons-grid';
import CommentGrid from './comment-grid';
import RatingGrid from './rating-grid';

export default function CollectedCardDetail({ setMemoOpen }) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const setIsSubSidebarOpen = useCheckStore(
    (state) => state.setIsSubSidebarOpen
  );
  const collectedCafeDetail = useMapStore(
    (state) => state.collectedCafeDetail[0]
  );

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          <span className="text-2xl font-semibold p-2">
            {collectedCafeDetail?.name}
          </span>
        </div>
        <button
          onClick={() => setIsSubSidebarOpen(false)}
          className="px-2 right-2"
        >
          <i className={getSubsidebarCloseIconStyle()}></i>
        </button>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <Image
            src={collectedCafeDetail?.photoUrl}
            alt="카페 썸네일"
            className="rounded-md"
            width={160}
            height={30}
          />
        </div>

        <div className="flex justify-between items-center">
          <RatingGrid rating={collectedCafeDetail?.rating} />
          <Button
            className={getDetailCollectButtonStyle()}
            variant="contained"
            onClick={() => setMemoOpen(true)}
          >
            수정하기
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <OpenTimeGrid
            openWeekly={collectedCafeDetail?.openWeekly}
            openWeekend={collectedCafeDetail?.openWeekend}
          />
          <LocationGrid address={collectedCafeDetail?.address} />
          <PhoneGrid phoneNum={collectedCafeDetail?.phoneNum} />

          <div className="col-span-2 grid grid-cols-3">
            <div className="bg-gray-400 bg-opacity-40 h-0.5 col-span-3"></div>
          </div>
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-2 text-2xl">CAFE SPEC</div>
          </div>

          <CommentGrid comment={collectedCafeDetail?.comment} />
          <ProsGrid pros={collectedCafeDetail?.pros} />
          <ConsGrid cons={collectedCafeDetail?.cons} />
          <EatenGrid eaten={collectedCafeDetail?.eaten} />
          <ConceptGrid concept={collectedCafeDetail?.concept} />
        </div>
      </div>
    </div>
  );
}
