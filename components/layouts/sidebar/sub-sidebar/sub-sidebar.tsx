'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useUploadCollectMutation } from 'hooks/mutation/useUploadCollectMutation';
import { useUpdateCollectMutation } from 'hooks/mutation/useUpdateCollectMutation';
import { useUploadRecommendMutation } from 'hooks/mutation/useUploadRecommendMutation';
import { CollectedRowInsert, CollectedRowUpdate } from 'actions/collectActions';
import { RecommendedRowInsert } from 'actions/recommendActions';
import { getSubSidebarStyle } from 'utils/styles';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('./shared/loading'), {
  ssr: false,
});
const NormalCafeDetail = dynamic(
  () => import('./normal-cafe/normal-cafe-detail'),
  {
    ssr: false,
  },
);
const CollectedCafeDetail = dynamic(
  () => import('./collected-cafe/collected-cafe-detail'),
  {
    ssr: false,
  },
);
const Memo = dynamic(() => import('./memo/memo'), {
  ssr: false,
});
const MemoRecommendation = dynamic(() => import('./memo/memo-recommendation'), {
  ssr: false,
});

export default function SubSidebar() {
  const [memoOpen, setMemoOpen] = useState<boolean>(false);
  const [memoRecommendationOpen, setMemoRecommendationOpen] =
    useState<boolean>(false);
  const [id, setId] = useState<string | undefined>('');
  const [rating, setRating] = useState<number>(5);
  const [selectedCategories, setSelectedCategoriesAction] = useState<string[]>(
    [],
  );
  const [comment, setComment] = useState<string>('');
  const [pros, setPros] = useState<string>('');
  const [cons, setCons] = useState<string>('');
  const [eaten, setEaten] = useState<string>('');

  const searchResult = useMapStore(state => state.searchResult);
  const cafeDetail = useMapStore(state => state.cafeDetail);
  const collectedCafeDetail = useMapStore(
    state => state.collectedCafeDetail[0],
  );
  const bookmarkedCafeDetail = useMapStore(
    state => state.bookmarkedCafeDetail[0],
  );
  const recommendedCafeDetail = useMapStore(
    state => state.recommendedCafeDetail[0],
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
  const setIsRecommended = useCheckStore(state => state.setIsRecommended);
  const isLoading = useCheckStore(state => state.isLoading);

  const pathname = usePathname();

  const uploadCollectMutation = useUploadCollectMutation();
  const updateCollectMutation = useUpdateCollectMutation();
  const uploadRecommendMutation = useUploadRecommendMutation();

  const filteredFromSearchResult = searchResult.filter(
    cafe => Number(cafe.id) === thisId,
  );

  const stringifiedCategories = JSON.stringify(selectedCategories);

  const detail = {
    id: thisId ?? 0,
    userId,
    coordX: thisX,
    coordY: thisY,
    category: null,
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

  const memoForCollectFromSearchDetail = {
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
    rating,
  };

  const memoForCollectFromCollectedDetail = {
    category: stringifiedCategories,
    comment,
    pros,
    cons,
    eaten,
    rating,
  };

  const memoForCollectFromBookmarkedDetail = {
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
    rating,
  };

  const memoForRecommendFromSearchDetail = {
    id: detail?.id,
    name: detail?.name,
    category: stringifiedCategories,
    coordX: thisX,
    coordY: thisY,
    photoUrl: detail?.photoUrl,
    address: detail?.address,
    openingHours: detail?.openingHours,
    phoneNum: detail?.phoneNum,
    menu: detail?.menu,
  };

  const memoForRecommendFromBookmarkedDetail = {
    id: bookmarkedCafeDetail?.id,
    userId,
    name: bookmarkedCafeDetail?.name,
    category: stringifiedCategories,
    coordX: bookmarkedCafeDetail?.coordX,
    coordY: bookmarkedCafeDetail?.coordY,
    photoUrl: bookmarkedCafeDetail?.photoUrl,
    address: bookmarkedCafeDetail?.address,
    openingHours: bookmarkedCafeDetail?.openingHours,
    phoneNum: bookmarkedCafeDetail?.phoneNum,
    menu: bookmarkedCafeDetail?.menu,
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
      setRating(collectedCafeDetail.rating || 5);
    }

    if (!isCollectedPage) {
      setComment('');
      setPros('');
      setCons('');
      setEaten('');
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

  const handleUploadCollect = (memo: CollectedRowInsert) => {
    setIsCollected(true);
    setMemoOpen(false);
    uploadCollectMutation.mutate(memo);
    toast.success('카드를 수집했습니다!');
  };

  const handleUpdateCollect = (memo: CollectedRowUpdate) => {
    try {
      updateCollectMutation.mutate(memo);
      toast.success('카드의 스펙을 수정했습니다!');

      setMemoOpen(false);
      setComment('');
      setPros('');
      setCons('');
      setEaten('');
      setSelectedCategoriesAction([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadRecommend = (memo: RecommendedRowInsert) => {
    setIsRecommended(true);
    setMemoRecommendationOpen(false);
    uploadRecommendMutation.mutate(memo);
    setSelectedCategoriesAction([]);
    toast.success('추천 카페에 추가했습니다');
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
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/search/detail') && (
              <NormalCafeDetail
                detail={detail}
                handleMenuOpen={handleMenuOpen}
                setMemoOpen={setMemoOpen}
                setMemoRecommendationOpen={setMemoRecommendationOpen}
              />
            )}

          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/collected/detail') && (
              <CollectedCafeDetail setMemoOpen={setMemoOpen} />
            )}

          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/bookmarked/detail') && (
              <NormalCafeDetail
                detail={bookmarkedCafeDetail}
                handleMenuOpen={handleMenuOpen}
                setMemoOpen={setMemoOpen}
                setMemoRecommendationOpen={setMemoRecommendationOpen}
              />
            )}

          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/recommended/detail') && (
              <NormalCafeDetail
                detail={recommendedCafeDetail}
                handleMenuOpen={handleMenuOpen}
                setMemoOpen={setMemoOpen}
                setMemoRecommendationOpen={setMemoRecommendationOpen}
              />
            )}

          {memoOpen && (
            <form
              id="memo"
              onSubmit={e => {
                e.preventDefault();
                if (isSearchResultPage)
                  handleUploadCollect(memoForCollectFromSearchDetail);
                if (isCollectedPage)
                  handleUpdateCollect(memoForCollectFromCollectedDetail);
                if (isBookmarkedPage)
                  handleUploadCollect(memoForCollectFromBookmarkedDetail);
              }}
            >
              <Memo
                detailName={detail?.name}
                collectedCafeDetailName={collectedCafeDetail?.name}
                bookmarkedCafeDetailName={bookmarkedCafeDetail?.name}
                recommendedCafeDetailName={recommendedCafeDetail?.name}
                comment={comment}
                pros={pros}
                cons={cons}
                eaten={eaten}
                setComment={setComment}
                setPros={setPros}
                setCons={setCons}
                setEaten={setEaten}
                setRating={setRating}
                rating={rating}
                isDarkTheme={isDarkTheme}
                setMemoOpen={setMemoOpen}
                selectedCategories={selectedCategories}
                setSelectedCategoriesAction={setSelectedCategoriesAction}
              />
            </form>
          )}

          {memoRecommendationOpen && (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (isSearchResultPage)
                  handleUploadRecommend(memoForRecommendFromSearchDetail);
                if (isBookmarkedPage)
                  handleUploadRecommend(memoForRecommendFromBookmarkedDetail);
              }}
            >
              <MemoRecommendation
                detailName={detail?.name}
                bookmarkedCafeDetailName={bookmarkedCafeDetail?.name}
                isDarkTheme={isDarkTheme}
                setMemoRecommendationOpen={setMemoRecommendationOpen}
                selectedCategories={selectedCategories}
                setSelectedCategoriesAction={setSelectedCategoriesAction}
              />
            </form>
          )}
        </>
      )}
    </aside>
  );
}
