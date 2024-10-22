import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBookmarked, deleteBookmarked } from 'actions/bookmarkActions';
import {
  getDetailBodyStyle,
  getDetailCollectButtonStyle,
  getDetailHeaderStyle,
  getSubsidebarCloseIconStyle,
} from 'utils/styles';
import { Button, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import CollectedBadge from 'components/layouts/sub-sidebar/normal/collected-badge';
import ReviewAndRatingGrid from './review-and-rating-grid';
import Image from 'next/image';
import OpenTimeGrid from '../open-time-grid';
import LocationGrid from '../location-grid';
import PhoneGrid from '../phone-grid';
import MenuGrid from './menu-grid';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function NormalCardDetail({
  detail,
  handleMenuOpen,
  setMemoOpen,
  menuOpen,
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const isCollected = useCheckStore((state) => state.isCollected);
  const isBookmarked = useCheckStore((state) => state.isBookmarked);
  const setIsSubSidebarOpen = useCheckStore(
    (state) => state.setIsSubSidebarOpen
  );

  const userId = useUserStore((state) => state.userId);

  const bookmarkedCafeDetail = useMapStore(
    (state) => state.bookmarkedCafeDetail[0]
  );

  const parsedMenu =
    !Array.isArray(detail?.menu) && detail?.menu
      ? JSON.parse(detail?.menu)
      : detail?.menu;

  const bookmarkMutation = useMutation({
    mutationFn: async (bookmarked) => await createBookmarked(bookmarked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      toast.success('새로운 카페를 북마크에 저장했습니다!');
      router.refresh();
    },
    onError: (error) => console.error(error),
  });

  const bookmarkCancelMutation = useMutation({
    mutationFn: async () =>
      await deleteBookmarked(bookmarkedCafeDetail?.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      toast.success('북마크에서 제거했습니다!');
      router.push('/cafe/bookmarked');
    },
    onError: (error) => {
      console.error(error);
      toast.error('북마크에서 제거하는데 문제가 발생했습니다');
    },
  });

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          {isBookmarked ? (
            <IconButton
              aria-label="bookmark"
              size="large"
              onClick={() => bookmarkCancelMutation.mutate()}
            >
              <BookmarkIcon className="text-yellow-500" />
            </IconButton>
          ) : (
            <IconButton
              aria-label="bookmark"
              size="large"
              onClick={() => bookmarkMutation.mutate(detail)}
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
          <i className={getSubsidebarCloseIconStyle()}></i>
        </button>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <Image
            src={detail?.photoUrl}
            alt="카페 썸네일"
            className="rounded-md"
            width={160}
            height={30}
          />
        </div>

        <div className="flex justify-between items-center">
          <ReviewAndRatingGrid
            reviewCount={detail?.reviewCount}
            rating={detail?.rating}
          />
          {isCollected ? (
            <CollectedBadge />
          ) : (
            <Button
              className={getDetailCollectButtonStyle()}
              variant="contained"
              onClick={() => setMemoOpen(true)}
            >
              수집하기
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <OpenTimeGrid
            openWeekly={detail?.openWeekly}
            openWeekend={detail?.openWeekend}
          />
          <LocationGrid address={detail?.address} />
          <PhoneGrid phoneNum={detail?.phoneNum} />
          <MenuGrid
            handleMenuOpen={handleMenuOpen}
            menuOpen={menuOpen}
            isDarkTheme={isDarkTheme}
            menu={parsedMenu}
          />
        </div>
      </div>
    </div>
  );
}
