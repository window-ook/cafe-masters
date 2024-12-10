'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useUploadCollectMutation } from 'hooks/useUploadCollectMutation';
import { useUpdateCollectMutation } from 'hooks/useUpdateCollectMutation';
import { CheckStore, MapStore, UserStore } from 'types/store';
import { getSubSidebarStyle } from 'utils/styles';
import { CollectedRowInsert, CollectedRowUpdate } from 'actions/collectActions';
import Memo from './memo';
import NormalCafeDetail from './normal-cafe/detail';
import CollectedCafeDetail from './collected-cafe/detail';

export default function SubSidebar() {
  const [memoOpen, setMemoOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [eaten, setEaten] = useState('');
  const [concept, setConcept] = useState('');
  const [rating, setRating] = useState(5);

  const userId = useUserStore((state: UserStore) => state.userId);

  const cafeDetail = useMapStore((state: MapStore) => state.cafeDetail);
  const collectedCafeDetail = useMapStore(
    (state: MapStore) => state.collectedCafeDetail[0],
  );
  const bookmarkedCafeDetail = useMapStore(
    (state: MapStore) => state.bookmarkedCafeDetail[0],
  );

  const thisX = useMapStore((state: MapStore) => state.thisX);
  const thisY = useMapStore((state: MapStore) => state.thisY);

  const isSubSidebarOpen = useCheckStore(
    (state: CheckStore) => state.isSubSidebarOpen,
  );

  const isMenuOpen = useCheckStore((state: CheckStore) => state.isMenuOpen);
  const setIsMenuOpen = useCheckStore(
    (state: CheckStore) => state.setIsMenuOpen,
  );
  const isDarkTheme = useCheckStore((state: CheckStore) => state.isDarkTheme);
  const setIsExtend = useCheckStore((state: CheckStore) => state.setIsExtend);
  const isExtend = useCheckStore((state: CheckStore) => state.isExtend);

  const pathname = usePathname();

  const detail = {
    id: cafeDetail?.basicInfo?.cid ?? 0,
    userId,
    name: cafeDetail?.basicInfo?.placenamefull ?? 'no-name',
    photoUrl:
      cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumbnail.webp',
    reviewCount: cafeDetail?.comment?.kamapComntcnt,
    rating:
      cafeDetail?.basicInfo?.feedback?.scorecnt &&
      cafeDetail?.basicInfo?.feedback?.scorecnt > 0 &&
      cafeDetail?.basicInfo?.feedback?.scoresum &&
      cafeDetail?.basicInfo?.feedback?.scoresum > 0
        ? parseFloat(
            (
              cafeDetail?.basicInfo?.feedback?.scoresum /
              cafeDetail?.basicInfo?.feedback?.scorecnt
            ).toFixed(2),
          )
        : null,
    openWeekly:
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[0]?.timeSE,
    openWeekend:
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[1]?.timeSE ||
      cafeDetail?.basicInfo?.openHour?.periodList?.[0]?.timeList?.[0]?.timeSE,
    address: cafeDetail?.basicInfo?.address
      ? cafeDetail.basicInfo.address.region?.newaddrfullname +
        ' ' +
        cafeDetail.basicInfo.address.newaddr?.newaddrfull +
        ' ' +
        (cafeDetail.basicInfo.address.addrdetail || '')
      : 'no-address',
    phoneNum: cafeDetail?.basicInfo?.phonenum ?? 'no-phoneNum',
    menu:
      Array.isArray(cafeDetail?.menuInfo?.menuList) &&
      cafeDetail?.menuInfo?.menuList.length > 0
        ? JSON.stringify(cafeDetail.menuInfo.menuList)
        : null,
    coordX: thisX,
    coordY: thisY,
  };

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
    rating: rating,
  };

  const memoFromCollectedDetail = {
    comment,
    pros,
    cons,
    eaten,
    concept,
  };

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
    rating: rating,
  };

  const uploadCollectMutation = useUploadCollectMutation();

  const updateCollectMutation = useUpdateCollectMutation();

  const handleUploadCollect = (newMemo: CollectedRowInsert) => {
    setMemoOpen(false);
    uploadCollectMutation.mutate(newMemo);
  };

  const handleUpdateCollect = (memo: CollectedRowUpdate) => {
    setMemoOpen(false);
    updateCollectMutation.mutate(memo);
  };

  const handleMenuOpen = () => {
    if (isMenuOpen === false) setIsMenuOpen(true);
    else setIsMenuOpen(false);
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
    <div
      className={getSubSidebarStyle(isSubSidebarOpen, isDarkTheme, isExtend)}
    >
      <div className="flex justify-center">
        <div
          className={`${isDarkTheme ? 'bg-gray-300' : 'bg-mainShadow'} w-16 h-2 sm:hidden rounded-2xl`}
          onClick={setIsExtend}
        />
      </div>
      {!memoOpen &&
        isSubSidebarOpen &&
        pathname.startsWith('/cafe/all/detail') && (
          <NormalCafeDetail
            detail={detail}
            handleMenuOpen={handleMenuOpen}
            setMemoOpen={setMemoOpen}
          />
        )}

      {!memoOpen &&
        isSubSidebarOpen &&
        pathname.startsWith('/cafe/collected/detail') && (
          <CollectedCafeDetail setMemoOpen={setMemoOpen} />
        )}

      {!memoOpen &&
        isSubSidebarOpen &&
        pathname.startsWith('/cafe/bookmarked/detail') && (
          <NormalCafeDetail
            detail={bookmarkedCafeDetail}
            handleMenuOpen={handleMenuOpen}
            setMemoOpen={setMemoOpen}
          />
        )}

      {memoOpen && (
        <form
          id="memo"
          onSubmit={e => {
            e.preventDefault();
            if (pathname.startsWith('/cafe/all'))
              handleUploadCollect(memoFromDetail);

            if (pathname.startsWith('/cafe/collected'))
              handleUpdateCollect(memoFromCollectedDetail);

            if (pathname.startsWith('/cafe/bookmarked'))
              handleUploadCollect(memoFromBookmarkedDetail);
          }}
        >
          <Memo
            detail={detail}
            collectedCafeDetail={collectedCafeDetail}
            bookmarkedCafeDetail={bookmarkedCafeDetail}
            setComment={setComment}
            setPros={setPros}
            setCons={setCons}
            setEaten={setEaten}
            setConcept={setConcept}
            setRating={setRating}
            rating={rating}
            isDarkTheme={isDarkTheme}
            setMemoOpen={setMemoOpen}
          />
        </form>
      )}
    </div>
  );
}
