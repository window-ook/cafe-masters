'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { Card } from '@mui/material';
import { createCollected, updateCollected } from 'actions/collectedActions';
import { createBookmarked, deleteBookmarked } from 'actions/bookmarkActions';
import { Button, IconButton, Rating } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CollectedBadge from './collected-badge';

export default function SubSidebar({ setIsSubSidebarOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [memoOpen, setMemoOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [eaten, setEaten] = useState('');
  const [concept, setConcept] = useState('');
  const [rating, setRating] = useState<number | null>(5);

  const userId = useUserStore((state) => state.userId);

  const setBookmarkedCafe = useMapStore((state) => state.setBookmarkedCafe);

  const cafeDetail = useMapStore((state) => state.cafeDetail);
  const collectedCafeDetail = useMapStore(
    (state) => state.collectedCafeDetail[0]
  );
  const bookmarkedCafeDetail = useMapStore(
    (state) => state.bookmarkedCafeDetail[0]
  );
  const thisX = useMapStore((state) => state.thisX);
  const thisY = useMapStore((state) => state.thisY);

  const isSubSidebarOpen = useCheckStore((state) => state.isSubSidebarOpen);
  const isCollected = useCheckStore((state) => state.isCollected);
  const isBookmarked = useCheckStore((state) => state.isBookmarked);
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);

  const router = useRouter();
  const pathname = usePathname();

  // 선택한 카페의 상세 정보
  const detail = {
    id: cafeDetail?.basicInfo?.cid,
    userId,
    name: cafeDetail?.basicInfo?.placenamefull,
    photoUrl: cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumb.webp',
    reviewCount: cafeDetail?.comment?.kamapComntcnt,
    rating:
      cafeDetail?.basicInfo?.feedback?.scorecnt > 0
        ? (
            cafeDetail?.basicInfo?.feedback?.scoresum /
            cafeDetail?.basicInfo?.feedback?.scorecnt
          ).toFixed(2)
        : null,
    openWeekly:
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[0]?.timeSE,
    openWeekend:
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[1]?.timeSE ||
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[0]?.timeSE,
    address:
      cafeDetail?.basicInfo?.address?.region?.newaddrfullname +
      ' ' +
      cafeDetail?.basicInfo?.address?.newaddr?.newaddrfull +
      ' ' +
      (cafeDetail?.basicInfo?.address?.addrdetail || ''),
    phoneNum: cafeDetail?.basicInfo?.phonenum,
    menu: cafeDetail?.menuInfo?.menuList,
    coordX: thisX,
    coordY: thisY,
  };

  // 선택한 카페의 상세 정보로부터 작성한 메모
  const memoFromDetail = {
    id: detail?.id,
    userId,
    name: detail?.name,
    photoUrl: detail?.photoUrl,
    address: detail?.address,
    openWeekly: detail?.openWeekly,
    openWeekend: detail?.openWeekend || detail?.openWeekly,
    phoneNum: detail?.phoneNum,
    coordX: thisX,
    coordY: thisY,
    comment,
    pros,
    cons,
    eaten,
    concept,
    rating,
  };

  // 수집한 카드 수정 메모
  const memoFromCollectedDetail = {
    comment,
    pros,
    cons,
    eaten,
    concept,
  };

  // 북마크한 카페에서 작성한 메모
  const memoFromBookmarkedDetail = {
    id: bookmarkedCafeDetail?.id,
    userId,
    name: bookmarkedCafeDetail?.name,
    photoUrl: bookmarkedCafeDetail?.photoUrl,
    address: bookmarkedCafeDetail?.address,
    openWeekly: bookmarkedCafeDetail?.openWeekly,
    openWeekend:
      bookmarkedCafeDetail?.openWeekend || bookmarkedCafeDetail?.openWeekly,
    phoneNum: bookmarkedCafeDetail?.phoneNum,
    coordX: bookmarkedCafeDetail?.coordX,
    coordY: bookmarkedCafeDetail?.coordY,
    comment,
    pros,
    cons,
    eaten,
    concept,
    rating,
  };

  // 메뉴 오픈
  const handleMenuOpen = () => setMenuOpen((prev) => !prev);

  // 수집하기
  const submitCollected = async (memo) => {
    try {
      await createCollected(memo);
      alert('새로운 카드를 수집했습니다!');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  // 수집한 카드의 메모 수정하기
  const submitUpdate = async (memo) => {
    try {
      await updateCollected(memo, collectedCafeDetail.id, userId);
      alert('카드 내용을 수정했습니다!');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  // 다음에 가 볼 카페 북마크하기
  const submitBookmarked = async (bookmarked) => {
    try {
      await createBookmarked(bookmarked);
      alert('북마크에 저장했습니다!');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  // 북마크 삭제하기
  const cancelBookmarked = async () => {
    try {
      await deleteBookmarked(bookmarkedCafeDetail.id, userId);
      setBookmarkedCafe((prevBookmarkedCafe) =>
        prevBookmarkedCafe.filter((cafe) => cafe.id !== bookmarkedCafeDetail.id)
      );
      alert('북마크에서 제거했습니다!');
      router.push('/cafe/bookmarked');
    } catch (error) {
      console.error(error);
    }
  };

  if ((pathname.startsWith('/cafe/all/detail') && !cafeDetail) || !userId)
    return null;

  if (
    (pathname.startsWith('/cafe/collected/detail') && !collectedCafeDetail) ||
    !userId
  )
    return null;

  if (
    (pathname.startsWith('/cafe/bookmarked/detail') && !bookmarkedCafeDetail) ||
    !userId
  )
    return null;

  return (
    <Card
      className={`h-[90vh] w-[100vw] max-w-[24rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 ${
        isSubSidebarOpen
          ? 'translate-x-[2rem] opacity-100'
          : 'translate-x-0 opacity-0'
      } z-10 overflow-y-scroll font-dpixel ${isDarkTheme ? 'bg-darkbg text-white' : ''} shadow-md`}
    >
      {!memoOpen && (
        <>
          {/* 일반 카드 상세 정보 */}
          {isSubSidebarOpen && pathname.startsWith('/cafe/all/detail') && (
            <div className={`flex flex-col p-2 gap-4 `}>
              <div
                className={`flex justify-between items-center shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
              >
                <div className="flex items-center">
                  {isBookmarked ? (
                    <IconButton
                      aria-label="bookmark"
                      size="large"
                      onClick={() => cancelBookmarked()}
                    >
                      <BookmarkIcon className="text-yellow-500" />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="bookmark"
                      size="large"
                      onClick={() => submitBookmarked(detail)}
                    >
                      <BookmarkIcon
                        className={`hover:scale-110 ${isDarkTheme ? 'text-white' : ''}`}
                      />
                    </IconButton>
                  )}
                  <span className="text-2xl font-semibold">{detail?.name}</span>
                </div>
                <button
                  onClick={() => setIsSubSidebarOpen(false)}
                  className="px-2 right-2"
                >
                  <i className="fa-solid fa-circle-xmark text-main text-2xl hover:text-opacity-70"></i>
                </button>
              </div>

              <div
                className={`flex flex-col gap-4 p-2 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
              >
                {/* 썸네일 */}
                <div className="flex flex-col items-center">
                  <img
                    src={detail?.photoUrl || '/image/cafe_thumb.webp'}
                    alt="카페 썸네일"
                    className="w-[10rem] rounded-md"
                  />
                </div>

                {/* 썸네일 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">리뷰 {detail?.reviewCount}</span>
                    <span className="text-xl flex gap-1 items-center">
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
                        <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
                      </div>
                      <span>{detail?.rating || ''}</span>
                    </span>
                  </div>

                  {isCollected ? (
                    <CollectedBadge />
                  ) : (
                    <Button
                      className="bg-red-400 hover:bg-opacity-70 text-white font-paperexbold rounded-2xl"
                      variant="contained"
                      onClick={() => setMemoOpen(true)}
                    >
                      수집하기
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* 영업시간 */}
                  <div className="col-span-2 grid grid-cols-3">
                    <div className="col-span-1 flex gap-1 items-center">
                      <i className="fa-solid fa-clock"></i>
                      <span>영업시간</span>
                    </div>
                    <div className="col-span-1 text-left">
                      <span>평일</span>
                    </div>
                    <div className="col-span-1 text-center ">
                      <span>{detail?.openWeekly}</span>
                    </div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1 text-left">
                      <span>주말</span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span>{detail?.openWeekend}</span>
                    </div>
                  </div>

                  {/* 위치 */}
                  <div className="col-span-2 grid grid-cols-3 items-center">
                    <div className="col-span-1 flex gap-1">
                      <i className="fa-solid fa-location-dot pt-1"></i>
                      <span>위치</span>
                    </div>
                    <div className="col-span-2 text-sm">{detail?.address}</div>
                  </div>

                  {/* 전화번호 */}
                  <div className="col-span-2 grid grid-cols-3 items-center">
                    <div className="col-span-1 flex gap-1">
                      <i className="fa-solid fa-phone pt-1"></i>
                      <span>전화번호</span>
                    </div>
                    <div className="col-span-2 text-lg">{detail?.phoneNum}</div>
                  </div>

                  {/* 메뉴 */}
                  <div className="col-span-2">
                    <div>
                      <div className="flex items-center">
                        <span className="text-lg">메뉴</span>
                        <IconButton onClick={handleMenuOpen}>
                          {menuOpen ? (
                            <i
                              className={`fa-solid fa-angle-up text-md ${isDarkTheme ? 'text-white' : ''}`}
                            />
                          ) : (
                            <i
                              className={`fa-solid fa-angle-down text-md ${isDarkTheme ? 'text-white' : ''}`}
                            />
                          )}
                        </IconButton>
                      </div>
                      <ul>
                        {menuOpen &&
                          detail?.menu?.map((item, index) => (
                            <li
                              key={index}
                              className="flex flex-col gap-1 mb-2"
                            >
                              <div className="w-30 border-t border-solid border-gray-400"></div>
                              <span className="font-bold text-lg">
                                {item?.menu}
                              </span>
                              <span className="text-lg">{item?.price}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 수집한 카드 상세 정보 */}
          {isSubSidebarOpen &&
            pathname.startsWith('/cafe/collected/detail') && (
              <div className={`flex flex-col p-2 gap-4 `}>
                <div
                  className={`flex justify-between items-center shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl font-semibold p-2">
                      {collectedCafeDetail.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSubSidebarOpen(false)}
                    className="px-2 right-2"
                  >
                    <i className="fa-solid fa-circle-xmark text-main text-2xl hover:text-opacity-70"></i>
                  </button>
                </div>

                <div
                  className={`flex flex-col gap-4 p-2 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        collectedCafeDetail.photoUrl || '/image/cafe_thumb.webp'
                      }
                      alt="카페 썸네일"
                      className="w-[10rem] rounded-md"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xl flex gap-1 items-center">
                      <div className="flex justify-start items-center gap-1">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100">
                          <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
                        </div>
                        {collectedCafeDetail.rating}
                      </div>
                    </span>
                    <Button
                      className="bg-red-400 hover:bg-opacity-70 text-white font-paperexbold rounded-2xl"
                      variant="contained"
                      onClick={() => setMemoOpen(true)}
                    >
                      수정하기
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* 영업시간 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1 items-center">
                        <i className="fa-solid fa-clock"></i>
                        <span>영업시간</span>
                      </div>
                      <div className="col-span-1 text-left">
                        <span>평일</span>
                      </div>
                      <div className="col-span-1 text-center ">
                        <span>{collectedCafeDetail.openWeekly}</span>
                      </div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1 text-left">
                        <span>주말</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span>{collectedCafeDetail.openWeekend}</span>
                      </div>
                    </div>

                    {/* 위치 */}
                    <div className="col-span-2 grid grid-cols-3 items-center">
                      <div className="col-span-1 flex gap-1">
                        <i className="fa-solid fa-location-dot pt-1"></i>
                        <span>위치</span>
                      </div>
                      <div className="col-span-2 text-sm">
                        {collectedCafeDetail.address}
                      </div>
                    </div>

                    {/* 전화번호 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1">
                        <i className="fa-solid fa-phone pt-1"></i>
                        <span>전화번호</span>
                      </div>
                      <div className="col-span-2 text-lg">
                        {collectedCafeDetail.phoneNum}
                      </div>
                    </div>

                    {/* SPEC */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="bg-gray-400 bg-opacity-40 h-0.5 col-span-3"></div>
                    </div>

                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-2 text-2xl">CAFE SPEC</div>
                    </div>

                    {/* 내 코멘트 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1">
                        <i className="fa-solid fa-pen pt-1"></i>
                        <span>내 코멘트</span>
                      </div>
                      <div className="col-span-2 text-md">
                        {collectedCafeDetail.comment}
                      </div>
                    </div>

                    {/* 좋은 점 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1">
                        <i className="fa-regular fa-face-smile pt-1"></i>
                        <span>좋은 점</span>
                      </div>
                      <div className="col-span-2 text-md">
                        {collectedCafeDetail.pros}
                      </div>
                    </div>

                    {/* 단점 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1">
                        <i className="fa-regular fa-face-frown pt-1"></i>
                        <span>별로인 점</span>
                      </div>
                      <div className="col-span-2 text-md">
                        {collectedCafeDetail.cons}
                      </div>
                    </div>

                    {/* 먹어본 메뉴 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1 pt-0.5">
                        <i className="fa-solid fa-mug-hot"></i>
                        <span className="text-sm">먹어본 메뉴</span>
                      </div>
                      <div className="col-span-2 text-md">
                        {collectedCafeDetail.eaten}
                      </div>
                    </div>

                    {/* 컨셉 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1 pt-0.5">
                        <i className="fa-solid fa-question"></i>
                        <span className="text-sm">카페의 컨셉</span>
                      </div>
                      <div className="col-span-2 text-md">
                        {collectedCafeDetail.concept}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* 북마크 카페 상세 정보 */}
          {isSubSidebarOpen &&
            pathname.startsWith('/cafe/bookmarked/detail') && (
              <div className={`flex flex-col p-2 gap-4 `}>
                <div
                  className={`flex justify-between items-center shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
                >
                  <div className="flex items-center">
                    {isBookmarked ? (
                      <IconButton
                        aria-label="bookmark"
                        size="large"
                        onClick={() => cancelBookmarked()}
                      >
                        <BookmarkIcon className="text-yellow-500" />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="bookmark"
                        size="large"
                        onClick={() => submitBookmarked(detail)}
                      >
                        <BookmarkIcon
                          className={`hover:scale-110 ${isDarkTheme ? 'text-white' : ''}`}
                        />
                      </IconButton>
                    )}
                    <h2 className="text-2xl font-semibold">
                      {bookmarkedCafeDetail.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsSubSidebarOpen(false)}
                    className="px-2 right-2"
                  >
                    <i className="fa-solid fa-circle-xmark text-main text-2xl hover:text-opacity-70"></i>
                  </button>
                </div>

                {/* 그리드로 변경 */}
                <div
                  className={`flex flex-col gap-4 p-2 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        bookmarkedCafeDetail.photoUrl ||
                        '/image/cafe_thumb.webp'
                      }
                      alt="카페 썸네일"
                      className="w-[10rem] rounded-md"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">리뷰 {detail.reviewCount}</span>
                      <span className="text-xl flex gap-1 items-center">
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
                          <i className="fa-solid fa-star absolute text-yellow-300 text-xs"></i>
                        </div>
                        <span>{bookmarkedCafeDetail.rating || ''}</span>
                      </span>
                    </div>
                    <span
                      className={`${isCollected ? `text-main` : 'text-black'} text-lg`}
                    >
                      {isCollected ? (
                        <CollectedBadge />
                      ) : (
                        <Button
                          className="bg-red-400 hover:bg-opacity-70 text-white font-paperexbold rounded-2xl"
                          variant="contained"
                          onClick={() => setMemoOpen(true)}
                        >
                          수집하기
                        </Button>
                      )}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* 영업시간 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1 items-center">
                        <i className="fa-solid fa-clock"></i>
                        <span>영업시간</span>
                      </div>
                      <div className="col-span-1 text-left">
                        <span>평일</span>
                      </div>
                      <div className="col-span-1 text-center ">
                        <span>{bookmarkedCafeDetail.openWeekly}</span>
                      </div>
                      {/* 두 번째 행: "평일 시간"과 "주말 시간" */}
                      <div className="col-span-1"></div> {/* 빈 공간 */}
                      <div className="col-span-1 text-left">
                        <span>주말</span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span>{bookmarkedCafeDetail.openWeekend}</span>
                      </div>
                    </div>

                    {/* 위치 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>위치</span>
                      </div>
                      <div className="col-span-2 text-sm">
                        {bookmarkedCafeDetail.address}
                      </div>
                    </div>

                    {/* 전화번호 */}
                    <div className="col-span-2 grid grid-cols-3">
                      <div className="col-span-1 flex gap-1 pt-1">
                        <i className="fa-solid fa-phone"></i>
                        <span>전화번호</span>
                      </div>
                      <div className="col-span-2 text-lg">
                        {bookmarkedCafeDetail.phoneNum}
                      </div>
                    </div>

                    {/* 메뉴 */}
                    <div className="col-span-2">
                      <div>
                        <div className="flex items-center">
                          <span className="text-lg">메뉴</span>
                          <IconButton onClick={handleMenuOpen}>
                            {menuOpen ? (
                              <i
                                className={`fa-solid fa-angle-up text-md ${isDarkTheme ? 'text-white' : ''}`}
                              />
                            ) : (
                              <i
                                className={`fa-solid fa-angle-down text-md ${isDarkTheme ? 'text-white' : ''}`}
                              />
                            )}
                          </IconButton>
                        </div>
                        <ul>
                          {menuOpen &&
                            JSON.parse(bookmarkedCafeDetail.menu).map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="flex flex-col gap-1 mb-2"
                                >
                                  <div className="w-30 border-t border-solid border-gray-400"></div>
                                  <span className="font-bold text-lg">
                                    {item.menu}
                                  </span>
                                  <span className="text-lg">{item.price}</span>
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      )}

      {/* 수집 메모 */}
      {memoOpen && (
        <form
          id="memo"
          className="flex flex-col p-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (pathname.startsWith('/cafe/all'))
              submitCollected(memoFromDetail);

            if (pathname.startsWith('/cafe/collected'))
              submitUpdate(memoFromCollectedDetail);

            if (pathname.startsWith('/cafe/bookmarked'))
              submitCollected(memoFromBookmarkedDetail);
          }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {pathname.startsWith('/cafe/all') && detail.name}
              {pathname.startsWith('/cafe/collected') &&
                collectedCafeDetail.name}
              {pathname.startsWith('/cafe/bookmarked') &&
                bookmarkedCafeDetail.name}
            </h2>
            <button
              onClick={() => setMemoOpen(false)}
              className={`${isDarkTheme ? 'shadow-mainShadow' : ''} shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 py-2 px-6`}
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>
          </div>
          <input
            required
            placeholder="내 코멘트(필수)"
            onChange={(e) => setComment(e.target.value)}
            className={`${isDarkTheme ? 'text-black' : ''} rounded-lg`}
          />
          <input
            placeholder="좋은 점"
            onChange={(e) => setPros(e.target.value)}
            className={`${isDarkTheme ? 'text-black' : ''} rounded-lg`}
          />
          <input
            placeholder="별로인 점"
            onChange={(e) => setCons(e.target.value)}
            className={`${isDarkTheme ? 'text-black' : ''} rounded-lg`}
          />
          <input
            required
            placeholder="먹어본 메뉴(필수)"
            onChange={(e) => setEaten(e.target.value)}
            className={`${isDarkTheme ? 'text-black' : ''} rounded-lg`}
          />
          <input
            placeholder="카페의 컨셉"
            onChange={(e) => setConcept(e.target.value)}
            className={`${isDarkTheme ? 'text-black' : ''} rounded-lg`}
          />
          <div className="flex items-center gap-2">
            <span>별점 매기기</span>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </div>
          <button
            type="submit"
            className={`${isDarkTheme ? 'shadow-mainShadow' : ''} shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 p-4`}
          >
            <span className="text-lg">완료</span>
          </button>
        </form>
      )}
    </Card>
  );
}
