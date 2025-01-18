'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useUploadCollectMutation } from 'hooks/mutation/useUploadCollectMutation';
import { useUpdateCollectMutation } from 'hooks/mutation/useUpdateCollectMutation';
import { getSubSidebarStyle } from 'utils/styles';
import { CollectedRowInsert, CollectedRowUpdate } from 'actions/collectActions';
import { toast } from 'react-toastify';
import Memo from './memo';
import NormalCafeDetail from './normal-cafe/detail';
import CollectedCafeDetail from './collected-cafe/detail';
import Loading from './shared/loading';

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
  const isMenuOpen = useCheckStore(state => state.isMenuOpen);
  const setIsMenuOpen = useCheckStore(state => state.setIsMenuOpen);
  const isSubSidebarOpen = useCheckStore(state => state.isSubSidebarOpen);
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const isExtend = useCheckStore(state => state.isExtend);
  const setIsExtend = useCheckStore(state => state.setIsExtend);
  const setIsCollected = useCheckStore(state => state.setIsCollected);
  const isLoading = useCheckStore(state => state.isLoading);

  const pathname = usePathname();

  const uploadCollectMutation = useUploadCollectMutation();
  const updateCollectMutation = useUpdateCollectMutation();

  const detail = {
    id: cafeDetail?.basicInfo?.cid ?? 0,
    userId,
    name: cafeDetail?.basicInfo?.placenamefull ?? 'no-name',
    photoUrl:
      cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumbnail.webp',
    photoList: cafeDetail?.photo?.photoList?.[1]?.list, // #음식 해시태그 리뷰사진
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

  const isSearchResultPage = pathname.startsWith('/cafe/all');
  const isCollectedPage = pathname.startsWith('/cafe/collected');
  const isBookmarkedPage = pathname.startsWith('/cafe/bookmarked');

  useEffect(() => {
    if (isCollectedPage && collectedCafeDetail) {
      setComment(collectedCafeDetail.comment || '');
      setPros(collectedCafeDetail.pros || '');
      setCons(collectedCafeDetail.cons || '');
      setEaten(collectedCafeDetail.eaten || '');
      setConcept(collectedCafeDetail.concept || '');
      setRating(collectedCafeDetail.rating || 5);
    }

    if (!isCollectedPage) {
      setComment('');
      setPros('');
      setCons('');
      setEaten('');
      setConcept('');
      setRating(5);
    }
  }, [pathname, collectedCafeDetail, isCollectedPage]);

  useEffect(() => {
    const newId =
      isSearchResultPage && detail?.id
        ? detail?.id
        : isCollectedPage && collectedCafeDetail?.id
          ? collectedCafeDetail?.id
          : isBookmarkedPage && bookmarkedCafeDetail?.id
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
    isSearchResultPage,
    isCollectedPage,
    isBookmarkedPage,
  ]);

  const handleMenuOpen = () => {
    if (isMenuOpen === false) setIsMenuOpen(true);
    else setIsMenuOpen(false);
  };

  const handleUploadCollect = (newMemo: CollectedRowInsert) => {
    setIsCollected(true);
    setMemoOpen(false);
    uploadCollectMutation.mutate(newMemo);
    toast.success('카드를 수집했습니다!');
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
                if (isSearchResultPage) handleUploadCollect(memoFromDetail);
                if (isCollectedPage)
                  handleUpdateCollect(memoFromCollectedDetail);
                if (isBookmarkedPage)
                  handleUploadCollect(memoFromBookmarkedDetail);
              }}
            >
              <Memo
                detailName={detail?.name}
                collectedCafeDetailName={collectedCafeDetail?.name}
                bookmarkedCafeDetailName={bookmarkedCafeDetail?.name}
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
        </>
      )}
    </div>
  );
}
