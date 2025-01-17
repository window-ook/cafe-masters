import { usePathname, useRouter } from 'next/navigation';
import { useUploadBookmarkMutation } from 'hooks/mutation/useUploadBookmarkMutation';
import { useCancelBookmarkMutation } from 'hooks/mutation/useCancelBookmarkMutation';
import { useCheckStore } from 'utils/store';
import { NormalCafeDetailForUpload } from 'types/common';
import {
  getDetailBodyStyle,
  DetailCollectButtonStyle,
  getDetailHeaderStyle,
  SubsidebarCloseIconStyle,
} from 'utils/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
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
  handleMenuOpen: () => void;
}

export default function NormalCafeDetail({
  detail,
  handleMenuOpen,
  setMemoOpen,
}: NormalCafeDetailProps) {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const isCollected = useCheckStore(state => state.isCollected);
  const isBookmarked = useCheckStore(state => state.isBookmarked);
  const setIsSubSidebarOpen = useCheckStore(state => state.setIsSubSidebarOpen);
  const setIsBookmarked = useCheckStore(state => state.setIsBookmarked);

  const router = useRouter();
  const pathname = usePathname();

  const parsedMenu =
    !Array.isArray(detail?.menu) && detail?.menu
      ? JSON.parse(detail?.menu)
      : detail?.menu;

  const uploadBookmarkMutation = useUploadBookmarkMutation();
  const cancelBookmarkMutation = useCancelBookmarkMutation();

  const handleUploadBookmark = () => {
    setIsBookmarked(true);
    uploadBookmarkMutation.mutate(detail);
    toast.success('가고 싶은 카페를 북마크했습니다!');
  };

  const handleCancelBookmark = () => {
    cancelBookmarkMutation.mutate();
    setIsSubSidebarOpen(false);
    toast.success('가고 싶은 카페를 제거했습니다!');
    router.push('/cafe/bookmarked');
  };

  const handleSetIsSubSidebarOpen = () => {
    setIsSubSidebarOpen(false);
    if (pathname.startsWith('/cafe/all')) router.push('/cafe/all');
    if (pathname.startsWith('/cafe/bookmarked'))
      router.push('/cafe/bookmarked');
  };

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <div className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          {isBookmarked ? (
            <button
              aria-label="북마크 취소 버튼"
              onClick={handleCancelBookmark}
            >
              <BookmarkIcon className="text-yellow-500" />
            </button>
          ) : (
            <button
              aria-label="북마크 저장 버튼"
              onClick={handleUploadBookmark}
            >
              <BookmarkIcon
                className={`hover:scale-105 ${isDarkTheme ? 'text-white' : ''}`}
              />
            </button>
          )}
          <span className="text-[1.375rem] font-semibold">{detail?.name}</span>
        </div>
        <button
          aria-label="카페 상세 정보 보기 취소 버튼"
          onClick={handleSetIsSubSidebarOpen}
          className="px-2 right-2"
        >
          <FontAwesomeIcon
            icon={faCircleXmark}
            className={SubsidebarCloseIconStyle}
          />
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
            isDarkTheme={isDarkTheme}
            menu={parsedMenu}
          />
        </div>
      </div>
    </div>
  );
}
