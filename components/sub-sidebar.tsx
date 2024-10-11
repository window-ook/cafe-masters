'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useBookmarkStore, useMapStore, useUserStore } from 'utils/store';
import { Card } from '@material-tailwind/react';
import { createCollected, getCollected } from 'actions/collectedActions';
import { createBookmarked } from 'actions/bookmarkActions';
import { Button, IconButton, Rating, TextField } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function SubSidebar({ isSubSidebarOpen, setIsSubSidebarOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [eaten, setEaten] = useState('');
  const [concept, setConcept] = useState('');
  const [rating, setRating] = useState<number | null>(5);
  const cafeDetail = useMapStore((state) => state.cafeDetail);
  const userId = useUserStore((state) => state.userId);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);

  const detail = {
    id: cafeDetail?.basicInfo?.cid,
    userId,
    name: cafeDetail?.basicInfo?.placenamefull,
    photoUrl: cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumb.webp',
    reviewCount: cafeDetail?.comment?.kamapComntcnt,
    rating: (
      cafeDetail?.basicInfo?.feedback?.scoresum /
      cafeDetail?.basicInfo?.feedback?.scorecnt
    ).toFixed(2),
    openWeekly:
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[0]?.timeSE,
    openWeekend:
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[1]?.timeSE,
    address:
      cafeDetail?.basicInfo?.address?.region?.newaddrfullname +
      ' ' +
      cafeDetail?.basicInfo?.address?.newaddr?.newaddrfull +
      ' ' +
      cafeDetail?.basicInfo?.address?.addrdetail,
    phoneNum: cafeDetail?.basicInfo?.phonenum,
    menu: cafeDetail?.menuInfo?.menuList,
    coordX: cafeDetail?.findway?.x,
    coordY: cafeDetail?.findway?.y,
  };

  const collected = {
    id: cafeDetail?.basicInfo?.cid,
    userId,
    name: cafeDetail?.basicInfo?.placenamefull,
    photoUrl: cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumb.webp',
    address:
      cafeDetail?.basicInfo?.address?.region?.newaddrfullname +
      ' ' +
      cafeDetail?.basicInfo?.address?.newaddr?.newaddrfull +
      ' ' +
      cafeDetail?.basicInfo?.address?.addrdetail,
    coordX: cafeDetail?.findway?.x,
    coordY: cafeDetail?.findway?.y,
    comment,
    pros,
    cons,
    eaten,
    concept,
    rating,
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleMenu = () => {
    setMenuOpen((prev) => !prev);
    console.log(menuOpen);
  };

  // 수집한 카페의 상세정보 불러오기
  const fetchCollectedCafe = () => {};

  // 수집하기
  const submitCollected = (collected) => {
    createCollected(collected);
    alert('새로운 카페를 수집했습니다!');
  };

  // 다음에 가 볼 카페 북마크하기
  const submitBookmarked = (bookmarked) => {
    createBookmarked(bookmarked);
    alert('북마크에 저장했습니다!');
  };

  const isCollected = false;

  return (
    <Card
      className={`h-[90vh] w-[100vw] max-w-[24rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 ${
        isSubSidebarOpen
          ? 'translate-x-[2rem] opacity-100'
          : 'translate-x-0 opacity-0'
      } z-10 overflow-y-scroll`}
    >
      {/* 상세 정보 */}
      {isSubSidebarOpen && pathname.startsWith('/cafe/detail') && (
        <div className="flex flex-col p-2 gap-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">{detail.name}</h2>
              {isBookmarked ? (
                <IconButton
                  aria-label="bookmark"
                  size="large"
                  disabled
                  onClick={() => submitBookmarked(detail)}
                >
                  <BookmarkIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="bookmark"
                  size="large"
                  onClick={() => submitBookmarked(detail)}
                >
                  <BookmarkIcon className="text-yellow-700" />
                </IconButton>
              )}
            </div>
            <button
              onClick={() => setIsSubSidebarOpen(false)}
              className="px-2 right-2"
            >
              <i className="fa-solid fa-circle-xmark text-main text-2xl"></i>
            </button>
          </div>

          <div className="flex justify-center">
            <img
              src={detail.photoUrl || '/image/cafe_thumb.webp'}
              alt="카페 썸네일"
              className="w-[10rem] rounded-md"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-2xl">CAFE INFO</span>
              <span
                className={`${isCollected ? `text-main` : 'text-black'} text-lg`}
              >
                {isCollected ? (
                  'COLLECTED'
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => router.push('/memo')}
                  >
                    수집하기
                  </Button>
                )}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xl">리뷰 {detail.reviewCount}</span>
              <span className="text-xl">
                {cafeDetail?.basicInfo?.feedback?.scorecnt > 0
                  ? detail.rating
                  : ''}
                <i className="fa-solid fa-star text-yellow-800 text-lg"></i>
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex gap-6">
                <span className="flex items-center gap-1 text-xl">
                  <i className="fa-solid fa-clock"></i>
                  영업시간
                </span>
                <div className="flex flex-col">
                  <span className="text-lg">평일</span>
                  <span>{detail.openWeekly}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg">주말</span>
                  {detail.openWeekly || detail.openWeekend}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl">위치</span>
                <span className="text-lg">{detail.address}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl">전화번호</span>
                <span className="text-lg">{detail.phoneNum}</span>
              </div>

              <div className="flex flex-col">
                <div>
                  <div className="flex items-center">
                    <span className="text-xl">메뉴</span>
                    <IconButton onClick={handleMenu}>
                      <i className="fa-solid fa-angle-down text-md" />
                    </IconButton>
                  </div>
                  <ul>
                    {menuOpen &&
                      detail.menu.map((item, index) => (
                        <li key={index} className="flex flex-col gap-1 mb-2">
                          <div className="w-30 border-t border-solid border-gray-400"></div>
                          <span className="font-bold text-lg">{item.menu}</span>
                          <span>{item.price}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메모 */}
      {pathname === '/memo' && (
        <form
          className="flex flex-col p-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitCollected(collected);
          }}
        >
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">
              {cafeDetail?.basicInfo?.placenamefull}
            </h2>
            <Button variant="contained" onClick={() => router.back()}>
              Back
            </Button>
          </div>
          <TextField
            required
            label="내 코멘트"
            variant="outlined"
            onChange={(e) => setComment(e.target.value)}
          />
          <TextField
            label="장점"
            variant="outlined"
            onChange={(e) => setPros(e.target.value)}
          />
          <TextField
            label="단점"
            variant="outlined"
            onChange={(e) => setCons(e.target.value)}
          />
          <TextField
            required
            label="먹어본 메뉴"
            variant="outlined"
            onChange={(e) => setEaten(e.target.value)}
          />
          <TextField
            label="카페 컨셉"
            variant="outlined"
            onChange={(e) => setConcept(e.target.value)}
          />
          <div className="flex items-center">
            <span>별점</span>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </div>
          <Button type="submit" variant="contained">
            완료
          </Button>
        </form>
      )}
    </Card>
  );
}
