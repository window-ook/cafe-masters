'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMapStore, useUserStore } from 'utils/store';
import { Card } from '@material-tailwind/react';
import { Button, IconButton, Rating, TextField } from '@mui/material';
import { createMemo, getThisMemo } from 'actions/memoActions';

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

  const memo = {
    id: cafeDetail?.basicInfo?.cid,
    userId: userId,
    placename: cafeDetail?.basicInfo?.placenamefull,
    address:
      cafeDetail?.basicInfo?.address?.region?.newaddrfullname +
      ' ' +
      cafeDetail?.basicInfo?.address?.newaddr?.newaddrfull +
      ' ' +
      cafeDetail?.basicInfo?.address?.addrdetail,
    coordX: cafeDetail?.findway?.x,
    coordY: cafeDetail?.findway?.y,
    photoUrl: cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumb.webp',
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

  // 선택 수집 카페의 정보 불러오기
  const getMemo = () => {};

  // 수집할 카페의 메모 저장하기
  const submitMemo = (memo) => {
    createMemo(memo);
    alert('새로운 카페를 수집했습니다!');
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
          <h2 className="text-xl font-semibold">
            {cafeDetail?.basicInfo?.placenamefull}
          </h2>

          <div className="flex justify-center">
            <img
              src={
                cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumb.webp'
              }
              alt="카페 썸네일"
              className="w-[10rem] rounded-md"
            />
          </div>
          <button
            onClick={() => setIsSubSidebarOpen(false)}
            className="px-2 absolute right-2"
          >
            <i className="fa-solid fa-circle-xmark text-main text-2xl"></i>
          </button>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-2xl">CAFE INFO</span>
              <span
                className={`${isCollected ? `text-main` : 'text-black'} text-lg`}
              >
                {isCollected ? (
                  'COLLECTED'
                ) : (
                  <button onClick={() => router.push('/memo')}>게또!</button>
                )}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xl">
                리뷰 {cafeDetail?.comment?.kamapComntcnt}
              </span>
              <span className="text-xl">
                {cafeDetail?.basicInfo?.feedback?.scorecnt > 0
                  ? (
                      cafeDetail.basicInfo.feedback.scoresum /
                      cafeDetail.basicInfo.feedback.scorecnt
                    ).toFixed(2)
                  : 0}
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
                  <span>
                    {
                      cafeDetail?.basicInfo?.openHour?.periodList?.[0]
                        ?.timeList?.[0]?.timeSE
                    }
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg">주말</span>
                  {
                    cafeDetail?.basicInfo?.openHour?.periodList?.[0]
                      ?.timeList?.[1]?.timeSE
                  }
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl">위치</span>
                <span className="text-lg">
                  {cafeDetail?.basicInfo?.address?.region?.newaddrfullname}{' '}
                  {cafeDetail?.basicInfo?.address?.newaddr?.newaddrfull}{' '}
                  {cafeDetail?.basicInfo?.address?.addrdetail}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl">전화번호</span>
                <span className="text-lg">
                  {cafeDetail?.basicInfo?.phonenum}
                </span>
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
                      cafeDetail?.menuInfo?.menuList?.map((menu, index) => (
                        <li key={index} className="flex flex-col gap-1 mb-2">
                          <div className="w-30 border-t border-solid border-gray-400"></div>
                          <span className="font-bold text-lg">{menu.menu}</span>
                          <span>{menu.price}</span>
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
            submitMemo(memo);
          }}
        >
          <h2 className="text-xl font-semibold">
            {cafeDetail?.basicInfo?.placenamefull}
          </h2>
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
            수집하기
          </Button>
        </form>
      )}
    </Card>
  );
}
