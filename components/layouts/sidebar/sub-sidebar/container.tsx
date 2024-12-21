'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useUploadCollectMutation } from 'hooks/mutation/useUploadCollectMutation';
import { useUpdateCollectMutation } from 'hooks/mutation/useUpdateCollectMutation';
import { getSubSidebarStyle } from 'utils/styles';
import { CollectedRowInsert, CollectedRowUpdate } from 'actions/collectActions';
import { toast } from 'react-toastify';
import Memo from './memo';
import NormalCafeDetail from './normal-cafe/detail';
import CollectedCafeDetail from './collected-cafe/detail';

export default function SubSidebar() {
  const [memoOpen, setMemoOpen] = useState(false);
  const [id, setId] = useState<string | undefined>('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [eaten, setEaten] = useState('');
  const [concept, setConcept] = useState('');
  const [rating, setRating] = useState(5);

  const cafeDetail = useMapStore(state => state.cafeDetail);
  const collectedCafeDetail = useMapStore(
    state => state.collectedCafeDetail[0],
  );
  const bookmarkedCafeDetail = useMapStore(
    state => state.bookmarkedCafeDetail[0],
  );
  const thisX = useMapStore(state => state.thisX);
  const thisY = useMapStore(state => state.thisY);

  const userId = useUserStore(state => state.userId);

  const isSubSidebarOpen = useCheckStore(state => state.isSubSidebarOpen);
  const isMenuOpen = useCheckStore(state => state.isMenuOpen);
  const setIsMenuOpen = useCheckStore(state => state.setIsMenuOpen);
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const setIsExtend = useCheckStore(state => state.setIsExtend);
  const isExtend = useCheckStore(state => state.isExtend);

  const pathname = usePathname();
  const router = useRouter();

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

  useEffect(() => {
    if (pathname.startsWith('/cafe/collected') && collectedCafeDetail) {
      setComment(collectedCafeDetail.comment || '');
      setPros(collectedCafeDetail.pros || '');
      setCons(collectedCafeDetail.cons || '');
      setEaten(collectedCafeDetail.eaten || '');
      setConcept(collectedCafeDetail.concept || '');
      setRating(collectedCafeDetail.rating || 5);
    }

    if (!pathname.startsWith('/cafe/collected')) {
      setComment('');
      setPros('');
      setCons('');
      setEaten('');
      setConcept('');
      setRating(5);
    }
  }, [pathname, collectedCafeDetail]);

  useEffect(() => {
    const newId =
      pathname.startsWith('/cafe/all') && detail?.id
        ? detail?.id
        : pathname.startsWith('/cafe/collected') && collectedCafeDetail?.id
          ? collectedCafeDetail?.id
          : pathname.startsWith('/cafe/bookmarked') && bookmarkedCafeDetail?.id
            ? bookmarkedCafeDetail?.id
            : null;

    const strId = newId?.toString();

    if (strId !== id) {
      setId(strId);
      setMemoOpen(false);
    }
  }, [
    pathname,
    detail?.id,
    collectedCafeDetail?.id,
    bookmarkedCafeDetail?.id,
    id,
  ]);

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

  const handleMenuOpen = () => {
    if (isMenuOpen === false) setIsMenuOpen(true);
    else setIsMenuOpen(false);
  };

  const handleUploadCollect = (newMemo: CollectedRowInsert) => {
    setMemoOpen(false);
    uploadCollectMutation.mutate(newMemo);
    toast.success('카드를 수집했습니다!');
    router.refresh();
  };

  const handleUpdateCollect = (memo: CollectedRowUpdate) => {
    setMemoOpen(false);
    setComment('');
    setPros('');
    setCons('');
    setEaten('');
    setConcept('');
    updateCollectMutation.mutate(memo);
    toast.success('카드의 스펙을 수정했습니다!');
    router.refresh();
  };

  if (pathname.startsWith('/cafe/all/detail') && !cafeDetail) return null;

  if (pathname.startsWith('/cafe/collected/detail') && !collectedCafeDetail)
    return null;

  if (pathname.startsWith('/cafe/bookmarked/detail') && !bookmarkedCafeDetail)
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
            comment={comment}
            pros={pros}
            cons={cons}
            eaten={eaten}
            concept={concept}
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
