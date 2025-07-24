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
import CollectedCafeDetail from './CollectedCafeDetail';
import LoadingDetail from './LodingDetail';
import NormalCafeDetail from './NormalCafeDetail';
import FormForCollect from './FormForCollect';
import FormForRecommend from './FormForRecommend';

export default function SubSidebar() {
  const [memoOpen, setMemoOpenAction] = useState<boolean>(false);
  const [memoRecommendationOpen, setMemoRecommendationOpenAction] =
    useState<boolean>(false);
  const [id, setId] = useState<string | undefined>('');
  const [rating, setRatingAction] = useState<number>(5);
  const [selectedCategories, setSelectedCategoriesAction] = useState<string[]>(
    [],
  );
  const [comment, setCommentAction] = useState<string>('');
  const [pros, setProsAction] = useState<string>('');
  const [cons, setConsAction] = useState<string>('');
  const [eaten, setEatenAction] = useState<string>('');

  const {
    searchResult,
    cafeDetail,
    setCafeDetail,
    currentCoordX,
    currentCoordY,
    currentCafeId,
  } = useMapStore();

  const collectedCafeDetail = useMapStore(
    state => state.collectedCafeDetail[0],
  );
  const bookmarkedCafeDetail = useMapStore(
    state => state.bookmarkedCafeDetail[0],
  );
  const recommendedCafeDetail = useMapStore(
    state => state.recommendedCafeDetail[0],
  );

  const userId = useUserStore(state => state.userId);

  const {
    isMenuOpen,
    setIsMenuOpen,
    isSubSidebarOpen,
    isDarkTheme,
    isExtend,
    setIsExtend,
    setIsCollected,
    setIsRecommended,
    isLoading,
    setIsLoading,
  } = useCheckStore();

  const pathname = usePathname();

  const uploadCollectMutation = useUploadCollectMutation();
  const updateCollectMutation = useUpdateCollectMutation();
  const uploadRecommendMutation = useUploadRecommendMutation();

  const filteredFromSearchResult = searchResult.filter(
    cafe => Number(cafe.id) === currentCafeId,
  );

  const stringifiedCategories = JSON.stringify(selectedCategories);

  const detail = {
    id: currentCafeId ?? 0,
    userId,
    coordX: currentCoordX,
    coordY: currentCoordY,
    category: null,
    name: filteredFromSearchResult?.[0]?.place_name ?? '',
    photoUrl: cafeDetail?.photo || '/image/cafe_thumbnail.avif',
    photoList: cafeDetail?.photoList || [],
    openingHours: cafeDetail?.openingHours || '',
    address: filteredFromSearchResult?.[0]?.road_address_name,
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
    coordX: currentCoordX,
    coordY: currentCoordY,
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
    coordX: currentCoordX,
    coordY: currentCoordY,
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
      setCommentAction(collectedCafeDetail.comment || '');
      setProsAction(collectedCafeDetail.pros || '');
      setConsAction(collectedCafeDetail.cons || '');
      setEatenAction(collectedCafeDetail.eaten || '');
      setRatingAction(collectedCafeDetail.rating || 5);
    }

    if (!isCollectedPage) {
      setCommentAction('');
      setProsAction('');
      setConsAction('');
      setEatenAction('');
      setRatingAction(5);
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
      setMemoOpenAction(false);
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

  const handleMenuOpenAction = () => {
    if (isMenuOpen === false) setIsMenuOpen(true);
    else setIsMenuOpen(false);
  };

  const handleUploadCollect = (memo: CollectedRowInsert) => {
    try {
      setIsCollected(true);
      setMemoOpenAction(false);
      uploadCollectMutation.mutate(memo);
      toast.success('카드를 수집했습니다!');
      setSelectedCategoriesAction([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCollect = (memo: CollectedRowUpdate) => {
    try {
      updateCollectMutation.mutate(memo);
      toast.success('카드의 스펙을 수정했습니다!');
      setMemoOpenAction(false);
      setCommentAction('');
      setProsAction('');
      setConsAction('');
      setEatenAction('');
      setSelectedCategoriesAction([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadRecommend = (memo: RecommendedRowInsert) => {
    try {
      setIsRecommended(true);
      setMemoRecommendationOpenAction(false);
      uploadRecommendMutation.mutate(memo);
      setSelectedCategoriesAction([]);
      toast.success('추천 카페에 추가했습니다');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefetch = async () => {
    setIsLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_REQUEST_URI;

      const REQ_URL =
        BASE_URL === 'http://localhost:3000'
          ? `/api/extra/${id}`
          : `/api/extra/product/${id}`;

      const response = await fetch(REQ_URL);
      const data = await response.json();
      setCafeDetail(data);
    } catch (error) {
      console.error('검색 결과 상세 정보 error:', error);
    } finally {
      setIsLoading(false);
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
        <LoadingDetail />
      ) : (
        <>
          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/search/detail') && (
              <NormalCafeDetail
                detail={detail}
                handleMenuOpenAction={handleMenuOpenAction}
                setMemoOpenAction={setMemoOpenAction}
                setMemoRecommendationOpenAction={
                  setMemoRecommendationOpenAction
                }
                onRefetch={handleRefetch}
              />
            )}

          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/collected/detail') && (
              <CollectedCafeDetail setMemoOpenAction={setMemoOpenAction} />
            )}

          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/bookmarked/detail') && (
              <NormalCafeDetail
                detail={bookmarkedCafeDetail}
                handleMenuOpenAction={handleMenuOpenAction}
                setMemoOpenAction={setMemoOpenAction}
                setMemoRecommendationOpenAction={
                  setMemoRecommendationOpenAction
                }
              />
            )}

          {!memoOpen &&
            !memoRecommendationOpen &&
            isSubSidebarOpen &&
            pathname.startsWith('/cafe/recommended/detail') && (
              <NormalCafeDetail
                detail={recommendedCafeDetail}
                handleMenuOpenAction={handleMenuOpenAction}
                setMemoOpenAction={setMemoOpenAction}
                setMemoRecommendationOpenAction={
                  setMemoRecommendationOpenAction
                }
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
              <FormForCollect
                detailName={detail?.name}
                collectedCafeDetailName={collectedCafeDetail?.name}
                bookmarkedCafeDetailName={bookmarkedCafeDetail?.name}
                recommendedCafeDetailName={recommendedCafeDetail?.name}
                comment={comment}
                pros={pros}
                cons={cons}
                eaten={eaten}
                setRatingAction={setRatingAction}
                setSelectedCategoriesAction={setSelectedCategoriesAction}
                setCommentAction={setCommentAction}
                setEatenAction={setEatenAction}
                setProsAction={setProsAction}
                setConsAction={setConsAction}
                rating={rating}
                isDarkTheme={isDarkTheme}
                setMemoOpenAction={setMemoOpenAction}
                selectedCategories={selectedCategories}
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
              <FormForRecommend
                detailName={detail?.name}
                bookmarkedCafeDetailName={bookmarkedCafeDetail?.name}
                isDarkTheme={isDarkTheme}
                setMemoRecommendationOpenAction={
                  setMemoRecommendationOpenAction
                }
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
