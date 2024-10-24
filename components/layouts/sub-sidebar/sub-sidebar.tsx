'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { getSubSidebarStyle } from 'utils/styles';
import {
  CollectedRowInsert,
  CollectedRowUpdate,
  createCollected,
  updateCollected,
} from 'actions/collectedActions';
import { Card } from '@mui/material';
import { toast } from 'react-toastify';
import Memo from './memo/memo';
import NormalCardDetail from './normal/normal-card-detail';
import CollectedCardDetail from './collected/collected-card-detail';

export default function SubSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [memoOpen, setMemoOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [eaten, setEaten] = useState('');
  const [concept, setConcept] = useState('');
  const [rating, setRating] = useState(5);

  const userId = useUserStore((state: any) => state.userId);

  const cafeDetail = useMapStore((state: any) => state.cafeDetail);
  const collectedCafeDetail = useMapStore(
    (state: any) => state.collectedCafeDetail[0]
  );
  const bookmarkedCafeDetail = useMapStore(
    (state: any) => state.bookmarkedCafeDetail[0]
  );
  const thisX = useMapStore((state: any) => state.thisX);
  const thisY = useMapStore((state: any) => state.thisY);

  const isSubSidebarOpen = useCheckStore(
    (state: any) => state.isSubSidebarOpen
  );
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const detail = {
    id: cafeDetail?.basicInfo?.cid,
    userId,
    name: cafeDetail?.basicInfo?.placenamefull,
    photoUrl:
      cafeDetail?.basicInfo?.mainphotourl || '/image/cafe_thumbnail.webp',
    reviewCount: cafeDetail?.comment?.kamapComntcnt,
    rating:
      cafeDetail?.basicInfo?.feedback?.scorecnt > 0
        ? parseFloat(
            (
              cafeDetail?.basicInfo?.feedback?.scoresum /
              cafeDetail?.basicInfo?.feedback?.scorecnt
            ).toFixed(2)
          )
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

  const collectMutation = useMutation({
    mutationFn: async (memo: CollectedRowInsert) => await createCollected(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
      toast.success(`새로운 카드를 수집했습니다!`);
      setMemoOpen(false);
      router.refresh();
    },
    onError: (error) => console.error(error),
  });

  const updateMutation = useMutation({
    mutationFn: async (memo: CollectedRowUpdate) =>
      await updateCollected(memo, collectedCafeDetail.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['collectedCafe', userId] });
      toast.success('카드의 스펙을 수정했습니다!');
      setMemoOpen(false);
      router.refresh();
    },
    onError: (error) => console.error(error),
  });

  const handleMenuOpen = () => setMenuOpen((prev) => !prev);

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
    <Card className={getSubSidebarStyle(isSubSidebarOpen, isDarkTheme)}>
      {!memoOpen &&
        isSubSidebarOpen &&
        pathname.startsWith('/cafe/all/detail') && (
          <NormalCardDetail
            detail={detail}
            handleMenuOpen={handleMenuOpen}
            setMemoOpen={setMemoOpen}
            menuOpen={menuOpen}
          />
        )}

      {!memoOpen &&
        isSubSidebarOpen &&
        pathname.startsWith('/cafe/collected/detail') && (
          <CollectedCardDetail setMemoOpen={setMemoOpen} />
        )}

      {!memoOpen &&
        isSubSidebarOpen &&
        pathname.startsWith('/cafe/bookmarked/detail') && (
          <NormalCardDetail
            detail={bookmarkedCafeDetail}
            handleMenuOpen={handleMenuOpen}
            setMemoOpen={setMemoOpen}
            menuOpen={menuOpen}
          />
        )}

      {memoOpen && (
        <form
          id="memo"
          onSubmit={(e) => {
            e.preventDefault();
            if (pathname.startsWith('/cafe/all'))
              collectMutation.mutate(memoFromDetail);

            if (pathname.startsWith('/cafe/collected'))
              updateMutation.mutate(memoFromCollectedDetail);

            if (pathname.startsWith('/cafe/bookmarked'))
              collectMutation.mutate(memoFromBookmarkedDetail);
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
    </Card>
  );
}
