import { useCheckStore } from 'utils/store';
import { Tooltip } from '@mui/material';
import {
  getDetailBodyStyle,
  RatingCircleStyle,
  DetailCollectButtonStyle,
  getDetailHeaderStyle,
  RatingStarStyle,
  SubsidebarCloseIconStyle,
} from 'utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faClock,
  faStar,
  faLocationDot,
  faCopy,
  faPhone,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Image from 'next/image';

export default function Loading() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          <BookmarkIcon
            className={`hover:scale-105 ${isDarkTheme ? 'text-white' : ''}`}
          />
          <span className="text-2xl font-semibold">로딩 중입니다...</span>
        </div>
        <div className="px-2 right-2">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className={SubsidebarCloseIconStyle}
          />
        </div>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <Image
            src={'/image/cafe_thumbnail.webp'}
            alt="카페 썸네일"
            width={0}
            height={0}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-xl">리뷰 ??</span>
            <span className="text-xl flex gap-1 items-center">
              <div className={RatingCircleStyle}>
                <FontAwesomeIcon icon={faStar} className={RatingStarStyle} />
              </div>
              <span>??</span>
            </span>
          </div>
          <div aria-label="수집하기 버튼" className={DetailCollectButtonStyle}>
            수집하기
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <FontAwesomeIcon icon={faClock} />
              <span className="font-dpixel">영업시간</span>
            </div>
            <div className="col-span-1 text-left">
              <span>평일</span>
            </div>
            <div className="col-span-1 text-center ">
              <span>??:?? ~ ??:??</span>
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-1 text-left">
              <span>주말</span>
            </div>
            <div className="col-span-1 text-center">
              <span>??:?? ~ ??:??</span>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex gap-1">
              <FontAwesomeIcon icon={faLocationDot} />
              <span className="font-dpixel">위치</span>
            </div>
            <div className="col-span-2 flex gap-4">
              <span className="text-sm">?? ??구 ??로</span>
              <Tooltip title="복사" placement="right-end">
                <div className="hover:opacity-70">
                  <FontAwesomeIcon icon={faCopy} />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-3 items-center">
            <div className="col-span-1 flex gap-1">
              <FontAwesomeIcon icon={faPhone} />
              <span className="font-dpixel">전화번호</span>
            </div>
            <div className="col-span-2 flex gap-4">
              <span className="text-lg">???-????-????</span>
              <Tooltip title="복사" placement="right-end">
                <div className="hover:opacity-70">
                  <FontAwesomeIcon icon={faCopy} />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">메뉴</span>
                <div aria-label="메뉴 보기 버튼">
                  <FontAwesomeIcon
                    icon={faAngleDown}
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
