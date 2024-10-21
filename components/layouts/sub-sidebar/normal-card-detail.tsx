import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBookmarked, deleteBookmarked } from 'actions/bookmarkActions';
import {
  getDetailHeaderStyle,
  getSubsidebarCloseIconStyle,
} from 'utils/styles';
import { Button, IconButton } from '@mui/material';
import CollectedBadge from 'components/collected-badge';
import ReviewAndRatingGrid from './review-and-rating-grid';
import Image from 'next/image';
import OpenTimeGrid from './open-time-grid';
import LocationGrid from './location-grid';
import PhoneGrid from './phone-grid';
import MenuGrid from './menu-grid';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function NormalCardDetail({
  detail,
  handleMenuOpen,
  setMemoOpen,
  menuOpen,
  setIsSubSidebarOpen,
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const isCollected = useCheckStore((state) => state.isCollected);
  const isBookmarked = useCheckStore((state) => state.isBookmarked);

  const userId = useUserStore((state) => state.userId);

  const setBookmarkedCafe = useMapStore((state) => state.setBookmarkedCafe);
  const bookmarkedCafeDetail = useMapStore(
    (state) => state.bookmarkedCafeDetail
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
      alert('북마크에 저장했습니다!');
      router.refresh();
    },
    onError: (error) => console.error(error),
  });

  const cancelMutation = useMutation({
    mutationFn: async () =>
      await deleteBookmarked(bookmarkedCafeDetail.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      setBookmarkedCafe((prevBookmarkedCafe) =>
        prevBookmarkedCafe.filter((cafe) => cafe.id !== bookmarkedCafeDetail.id)
      );
      alert('북마크에서 제거했습니다!');
      router.push('/cafe/bookmarked');
    },
    onError: (error) => {
      console.error('북마크 제거 중 오류 발생:', error);
      alert('북마크에서 제거하는 도중 문제가 발생했습니다.');
    },
  });

  return (
    <div className={`flex flex-col p-2 gap-4 `}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          {isBookmarked ? (
            <IconButton
              aria-label="bookmark"
              size="large"
              onClick={() => cancelMutation.mutate()}
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

      <div
        className={`flex flex-col gap-4 p-2 shadow-md ${isDarkTheme ? 'shadow-mainShadow' : ''} rounded-md`}
      >
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
              className="bg-red-400 hover:bg-opacity-70 text-white font-paperexbold rounded-2xl"
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
