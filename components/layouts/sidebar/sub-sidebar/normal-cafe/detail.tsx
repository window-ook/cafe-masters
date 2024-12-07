import { useCheckStore, useMapStore, useUserStore } from 'utils/store';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { CheckStore, MapStore, UserStore } from 'types/store';
import { NormalCafeDetailForUpload } from 'types/common';
import {
  BookmarkedRowInsert,
  createBookmarkedCafe,
  deleteBookmarkedCafe,
} from 'actions/bookmarkActions';
import {
  getDetailBodyStyle,
  DetailCollectButtonStyle,
  getDetailHeaderStyle,
  SubsidebarCloseIconStyle,
} from 'utils/styles';
import { toast } from 'react-toastify';
import CollectedBadge from 'components/layouts/sidebar/sub-sidebar/normal-cafe/collected-badge';
import ReviewAndRatingGrid from './review-and-rating-grid';
import Image from 'next/image';
import OpenTimeGrid from '../shared/open-time-grid';
import LocationGrid from '../shared/location-grid';
import PhoneGrid from '../shared/phone-grid';
import MenuGrid from './menu-grid';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface NormalCafeDetailProps {
  setMemoOpen: (open: boolean) => void;
  detail: NormalCafeDetailForUpload;
  menuOpen: boolean;
  handleMenuOpen: () => void;
}

export default function NormalCafeDetail({
  detail,
  handleMenuOpen,
  setMemoOpen,
  menuOpen,
}: NormalCafeDetailProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const isDarkTheme = useCheckStore((state: CheckStore) => state.isDarkTheme);
  const isCollected = useCheckStore((state: CheckStore) => state.isCollected);
  const isBookmarked = useCheckStore((state: CheckStore) => state.isBookmarked);
  const setIsSubSidebarOpen = useCheckStore(
    (state: CheckStore) => state.setIsSubSidebarOpen,
  );

  const userId = useUserStore((state: UserStore) => state.userId);

  const bookmarkedCafeDetail = useMapStore(
    (state: MapStore) => state.bookmarkedCafeDetail[0],
  );

  const parsedMenu =
    !Array.isArray(detail?.menu) && detail?.menu
      ? JSON.parse(detail?.menu)
      : detail?.menu;

  const bookmarkMutation = useMutation({
    mutationFn: async (detail: BookmarkedRowInsert) =>
      await createBookmarkedCafe(detail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      toast.success('새로운 카페를 북마크에 저장했습니다!');
      router.refresh();
    },
    onError: error => console.error(error),
  });

  const bookmarkCancelMutation = useMutation({
    mutationFn: async () =>
      await deleteBookmarkedCafe(bookmarkedCafeDetail?.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      toast.success('북마크에서 제거했습니다!');
      router.push('/cafe/bookmarked');
    },
    onError: error => {
      console.error(error);
      toast.error('북마크에서 제거하는데 문제가 발생했습니다');
    },
  });

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          {isBookmarked ? (
            <button
              aria-label="북마크 취소 버튼"
              onClick={() => bookmarkCancelMutation.mutate()}
            >
              <BookmarkIcon className="text-yellow-500" />
            </button>
          ) : (
            <button
              aria-label="북마크 저장 버튼"
              onClick={() => bookmarkMutation.mutate(detail)}
            >
              <BookmarkIcon
                className={`hover:scale-110 ${isDarkTheme ? 'text-white' : ''}`}
              />
            </button>
          )}
          <span className="text-2xl font-semibold">{detail?.name}</span>
        </div>
        <button
          aria-label="카페 상세 정보 보기 취소 버튼"
          onClick={() => setIsSubSidebarOpen(false)}
          className="px-2 right-2"
        >
          <i className={SubsidebarCloseIconStyle}></i>
        </button>
      </div>

      <div className={getDetailBodyStyle(isDarkTheme)}>
        <div className="flex flex-col items-center">
          <Image
            src={detail?.photoUrl || '/image/cafe_thumbnail.webp'}
            alt="카페 썸네일"
            className="rounded-md w-auto h-auto transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
            width={160}
            height={30}
            onClick={() =>
              window.open(`http://place.map.kakao.com/${detail?.id}`, '_blank')
            }
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
            <button
              aria-label="수집하기 버튼"
              className={DetailCollectButtonStyle}
              onClick={() => setMemoOpen(true)}
            >
              수집하기
            </button>
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
