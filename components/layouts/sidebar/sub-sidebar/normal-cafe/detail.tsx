import { useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUploadBookmarkMutation } from 'hooks/mutation/useUploadBookmarkMutation';
import { useCancelBookmarkMutation } from 'hooks/mutation/useCancelBookmarkMutation';
import { useCheckStore } from 'utils/store';
import { NormalCafeDetailForBookmark } from 'types/common';
import {
  getDetailBodyStyle,
  DetailCollectButtonStyle,
  getDetailHeaderStyle,
  SubsidebarCloseIconStyle,
} from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import { IoBookmark } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from 'components/layouts/sidebar/sub-sidebar/normal-cafe/collected-badge';
import OpenTimeGrid from '../shared/open-time-grid';
import LocationGrid from '../shared/location-grid';
import PhoneGrid from '../shared/phone-grid';
import MenuGrid from './menu-grid';

interface NormalCafeDetailProps {
  detail: NormalCafeDetailForBookmark;
  handleMenuOpen: () => void;
  setMemoOpen: (open: boolean) => void;
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const pathname = usePathname();

  const uploadBookmarkMutation = useUploadBookmarkMutation();
  const cancelBookmarkMutation = useCancelBookmarkMutation();

  const menu =
    !Array.isArray(detail?.menu) && detail?.menu
      ? JSON.parse(detail?.menu)
      : detail?.menu;

  const handleUploadBookmark = () => {
    setIsBookmarked(true);
    const bookmarkData = {
      ...detail,
      photoList: detail.photoList ? JSON.stringify(detail.photoList) : null,
    };
    uploadBookmarkMutation.mutate(bookmarkData);
    toast.success('가고 싶은 카페를 북마크했습니다!');
  };

  const handleCancelBookmark = () => {
    cancelBookmarkMutation.mutate();
    setIsSubSidebarOpen(false);
    toast.success('가고 싶은 카페를 제거했습니다!');
  };

  const handleSetIsSubSidebarOpen = () => {
    setIsSubSidebarOpen(false);
    if (pathname.startsWith('/cafe/search')) router.push('/cafe/search');
    if (pathname.startsWith('/cafe/bookmarked'))
      router.push('/cafe/bookmarked');
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.9;
    scrollRef.current.scrollTo({
      left:
        direction === 'left'
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount * 0.6,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`flex flex-col p-2 gap-4`}>
      <header className={getDetailHeaderStyle(isDarkTheme)}>
        <div className="flex items-center">
          {isBookmarked ? (
            <button
              data-cy="cancel-bookmark-button"
              aria-label="북마크 취소 버튼"
              onClick={handleCancelBookmark}
              className="flex items-center"
            >
              <IoBookmark className="pr-2 text-yellow-500 text-3xl" />
            </button>
          ) : (
            <button
              data-cy="upload-bookmark-button"
              aria-label="북마크 저장 버튼"
              onClick={handleUploadBookmark}
              className="flex items-center"
            >
              <IoBookmark
                className={`pr-2 text-3xl ${isDarkTheme ? 'text-white' : ''}`}
              />
            </button>
          )}
          <span className="text-[1.375rem] font-dpixel font-semibold">
            {detail?.name}
          </span>
        </div>
        <button
          aria-label="카페 상세 정보 보기 취소 버튼"
          onClick={handleSetIsSubSidebarOpen}
          className="px-2 right-2"
        >
          <IoCloseCircle className={SubsidebarCloseIconStyle} />
        </button>
      </header>

      {/* 가로 스크롤 구현 */}
      <main className={getDetailBodyStyle(isDarkTheme)}>
        <section className="relative flex flex-col items-center">
          <button
            className={`absolute left-0 z-10 px-2 py-1 shadow-md rounded-md top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'bg-main' : 'bg-white'}`}
            onClick={() => handleScroll('left')}
          >
            <span className={`${isDarkTheme ? '' : 'text-main'}`}>◀</span>
          </button>
          <div
            ref={scrollRef}
            className="flex gap-4 mt-4 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
          >
            <div className="snap-center flex-shrink-0 h-[15rem] py-2">
              <Image
                data-cy="normal-detail-thumbnail"
                src={detail?.photoUrl || '/image/cafe_thumbnail.avif'}
                alt="카페 썸네일"
                width={160}
                height={240}
                className="w-[20rem] h-full rounded-md object-cover transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
                priority={true}
                onClick={() =>
                  window.open(
                    `http://place.map.kakao.com/${detail?.id}`,
                    '_blank',
                  )
                }
              />
            </div>
            {detail?.photoList?.map((photo, i) => {
              return (
                <div
                  key={i}
                  className="snap-center py-2 flex-shrink-0 h-[15rem]"
                >
                  <Image
                    key={photo}
                    data-cy="normal-detail-thumbnail"
                    alt="카페 썸네일"
                    src={photo || '/image/cafe_thumbnail.avif'}
                    width={160}
                    height={240}
                    className="w-[20rem] h-full rounded-md object-cover transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
                    priority={true}
                    onClick={() =>
                      window.open(
                        `http://place.map.kakao.com/${detail?.id}`,
                        '_blank',
                      )
                    }
                  />
                </div>
              );
            })}
            <button
              className={`absolute right-0 z-10 px-2 py-1 shadow-md rounded-md top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'bg-main' : 'bg-white'}`}
              onClick={() => handleScroll('right')}
            >
              <span className={`${isDarkTheme ? '' : 'text-main'}`}>▶</span>
            </button>
          </div>
        </section>

        <section className="flex justify-between items-center">
          <span className="font-dpixel font-extrabold text-xl">상세 정보</span>
          {isCollected ? (
            <CollectedBadge />
          ) : (
            <button
              data-cy="collect-button"
              aria-label="수집하기 버튼"
              className={DetailCollectButtonStyle}
              onClick={() => setMemoOpen(true)}
            >
              수집하기
            </button>
          )}
        </section>

        <section className="grid grid-cols-2 gap-6">
          <OpenTimeGrid openingHours={detail?.openingHours} />
          <LocationGrid address={detail?.address} />
          <PhoneGrid phoneNum={detail?.phoneNum} />
          <MenuGrid
            handleMenuOpen={handleMenuOpen}
            isDarkTheme={isDarkTheme}
            menu={menu}
          />
        </section>
      </main>
    </div>
  );
}
