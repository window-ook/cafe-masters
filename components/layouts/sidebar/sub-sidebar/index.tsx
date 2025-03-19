'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useUploadCollectMutation } from 'hooks/mutation/useUploadCollectMutation';
import { useUpdateCollectMutation } from 'hooks/mutation/useUpdateCollectMutation';
import { getSubSidebarStyle } from 'utils/styles';
import { CollectedRowInsert, CollectedRowUpdate } from 'actions/collectActions';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import Loading from './shared/loading';

const NormalCafeDetail = dynamic(() => import('./normal-cafe/detail'), {
  ssr: false,
});

const CollectedCafeDetail = dynamic(() => import('./collected-cafe/detail'), {
  ssr: false,
});

const Memo = dynamic(() => import('./memo'), {
  ssr: false,
});

export default function SubSidebar() {
  const [memoOpen, setMemoOpen] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>('');
  const [comment, setComment] = useState<string>('');
  const [pros, setPros] = useState<string>('');
  const [cons, setCons] = useState<string>('');
  const [eaten, setEaten] = useState<string>('');
  const [concept, setConcept] = useState<string>('');
  const [rating, setRating] = useState<number>(5);

  const searchResult = useMapStore(state => state.searchResult);
  const cafeDetail = useMapStore(state => state.cafeDetail);
  const collectedCafeDetail = useMapStore(
    state => state.collectedCafeDetail[0],
  );
  const bookmarkedCafeDetail = useMapStore(
    state => state.bookmarkedCafeDetail[0],
  );
  const thisX = useMapStore(state => state.thisX);
  const thisY = useMapStore(state => state.thisY);
  const thisId = useMapStore(state => state.thisId);

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

  const filteredFromSearchResult = searchResult.filter(
    cafe => Number(cafe.id) === thisId,
  );

  const detail = {
    id: thisId ?? 0,
    userId,
    coordX: thisX,
    coordY: thisY,
    name: filteredFromSearchResult?.[0]?.place_name ?? '',
    photoUrl: cafeDetail?.photo || '/image/cafe_thumbnail.avif',
    photoList: cafeDetail?.photoList || [],
    openingHours: cafeDetail?.openingHours || '',
    address:
      cafeDetail?.address || filteredFromSearchResult?.[0]?.road_address_name,
    phoneNum: filteredFromSearchResult?.[0]?.phone ?? '',
    menu:
      Array.isArray(cafeDetail?.menu) && cafeDetail?.menu.length > 0
        ? JSON.stringify(cafeDetail.menu)
        : null,
  };

  const memoFromDetail = {
    id: detail?.id,
    userId,
    name: detail?.name,
    photoUrl: detail?.photoUrl,
    address: detail?.address,
    openingHours: detail?.openingHours,
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

  const memoFromCollectedDetail = {
    comment,
    pros,
    cons,
    eaten,
    concept,
    rating,
  };

  const memoFromBookmarkedDetail = {
    id: bookmarkedCafeDetail?.id,
    userId,
    name: bookmarkedCafeDetail?.name,
    photoUrl: bookmarkedCafeDetail?.photoUrl,
    address: bookmarkedCafeDetail?.address,
    openingHours: bookmarkedCafeDetail?.openingHours,
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

  const isSearchResultPage = pathname.startsWith('/cafe/search');
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
    try {
      console.log('업데이트 요청 보냄:', memo);
      updateCollectMutation.mutate(memo);
      toast.success('카드의 스펙을 수정했습니다!');

      setMemoOpen(false);
      setComment('');
      setPros('');
      setCons('');
      setEaten('');
      setConcept('');
    } catch (error) {
      console.error(error);
    }
  };

  if (pathname.startsWith('/cafe/search/detail') && !cafeDetail) return null;
  if (pathname.startsWith('/cafe/collected/detail') && !collectedCafeDetail)
    return null;
  if (pathname.startsWith('/cafe/bookmarked/detail') && !bookmarkedCafeDetail)
    return null;

  return (
    <aside
      className={getSubSidebarStyle(isSubSidebarOpen, isDarkTheme, isExtend)}
    >
      <div className="flex justify-center">
        <button
          aria-label="모바일: 서브사이드바 업 다운 버튼"
          className={`${isDarkTheme ? 'bg-gray-300' : 'bg-main-shadow'} w-16 h-2 sm:hidden rounded-2xl`}
          onClick={setIsExtend}
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!memoOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/search/detail') && (
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
    </aside>
  );
}
