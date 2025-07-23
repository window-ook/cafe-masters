import { useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUploadBookmarkMutation } from 'hooks/mutation/useUploadBookmarkMutation';
import { useDeleteBookmarkMutation } from 'hooks/mutation/useDeleteBookmarkMutation';
import { useCheckStore, useUserStore } from 'utils/store';
import {
  NormalCafeDetailForBookmark,
  NormalCafeDetailForRecommend,
} from 'types/common';
import { getDetailBodyStyle, getDetailHeaderStyle } from 'utils/styles';
import { IoCloseCircle } from 'react-icons/io5';
import { IoBookmark } from 'react-icons/io5';
import { IoRefreshCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CollectedBadge from 'components/layouts/sidebar/sub-sidebar/normal-cafe/collected-badge';
import OpenTimeGrid from '../shared/open-time-grid';
import LocationGrid from '../shared/location-grid';
import PhoneGrid from '../shared/phone-grid';
import MenuGrid from './menu-grid';
import CategoryGrid from '../collected-cafe/category-grid';

interface NormalCafeDetailProps {
  detail: NormalCafeDetailForBookmark | NormalCafeDetailForRecommend;
  handleMenuOpenAction: () => void;
  setMemoOpenAction: (open: boolean) => void;
  setMemoRecommendationOpenAction: (open: boolean) => void;
  onRefetch?: () => void;
}

export default function NormalCafeDetail({
  detail,
  handleMenuOpenAction,
  setMemoOpenAction,
  setMemoRecommendationOpenAction,
  onRefetch,
}: NormalCafeDetailProps) {
  const { admin, userId } = useUserStore();
  const {
    isDarkTheme,
    isCollected,
    isBookmarked,
    isRecommended,
    setIsSubSidebarOpen,
    setIsBookmarked,
  } = useCheckStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const pathname = usePathname();

  const uploadBookmarkMutation = useUploadBookmarkMutation();
  const deleteBookmarkMutation = useDeleteBookmarkMutation();

  const menu =
    !Array.isArray(detail?.menu) && detail?.menu
      ? JSON.parse(detail?.menu)
      : detail?.menu;

  const parsedCategory: string[] = detail?.category
    ? JSON.parse(detail?.category)
    : [];

  const handleUploadBookmark = () => {
    setIsBookmarked(true);
    const bookmarkData = {
      ...detail,
      userId,
      photoList: detail.photoList ? JSON.stringify(detail.photoList) : null,
    };
    uploadBookmarkMutation.mutate(bookmarkData);
    toast.success('북마크 했습니다!');
  };

  const handleDeleteBookmark = () => {
    deleteBookmarkMutation.mutate(detail.id);
    setIsSubSidebarOpen(false);
    toast.success('북마크 취소했습니다!');
  };

  const handleSetIsSubSidebarOpen = () => {
    setIsSubSidebarOpen(false);
    if (pathname.startsWith('/cafe/search')) router.push('/cafe/search');
    if (pathname.startsWith('/cafe/collected')) router.push('/cafe/collected');
    if (pathname.startsWith('/cafe/bookmarked'))
      router.push('/cafe/bookmarked');
    if (pathname.startsWith('/cafe/recommended'))
      router.push('/cafe/recommended');
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
              aria-label="북마크 삭제 버튼"
              onClick={handleDeleteBookmark}
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
        <div className="flex items-center">
          {pathname.includes('/cafe/search') && onRefetch && (
            <button
              aria-label="데이터 다시 불러오기"
              onClick={onRefetch}
              className="px-2 rounded-full"
            >
              <IoRefreshCircle className="text-main text-3xl hover:text-opacity-70" />
            </button>
          )}
          <button
            aria-label="상세 정보 닫기 버튼"
            onClick={handleSetIsSubSidebarOpen}
            className="px-2 rounded-full right-2"
          >
            <IoCloseCircle className="text-main text-3xl hover:text-opacity-70" />
          </button>
        </div>
      </header>

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
            <div className="snap-center shrink-0 h-60 py-2">
              {detail?.photoUrl?.trim() && (
                <a
                  data-cy="normal-detail-thumbnail"
                  onClick={() =>
                    window.open(
                      `http://place.map.kakao.com/${detail?.id}`,
                      '_blank',
                    )
                  }
                >
                  <Image
                    src={detail.photoUrl || '/image/cafe_thumbnail.avif'}
                    alt="카페 썸네일"
                    width={160}
                    height={240}
                    priority={true}
                    className="w-[20rem] h-full rounded-md object-cover transform duration-300 ease-out hover:opacity-30 hover:cursor-pointer"
                  />
                </a>
              )}
            </div>
            {detail?.photoList?.map((photo, i) => {
              return (
                <div key={i} className="snap-center py-2 shrink-0 h-60">
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
          <div className="flex items-center gap-2">
            {admin &&
              !isRecommended &&
              !pathname.startsWith('/cafe/recommended') ? (
              <button
                data-cy="collect-button"
                aria-label="추천하기 버튼"
                className="px-3 py-2 bg-red-400 rounded-lg font-bold font-pretendard text-white hover:bg-opacity-70 transition duration-200 ease"
                onClick={() => setMemoRecommendationOpenAction(true)}
              >
                추천하기
              </button>
            ) : (
              ''
            )}
            {isCollected ? (
              <CollectedBadge />
            ) : (
              <button
                data-cy="collect-button"
                aria-label="수집하기 버튼"
                className="px-3 py-2 bg-red-400 rounded-lg font-bold font-pretendard text-white hover:bg-opacity-70 transition duration-200 ease"
                onClick={() => setMemoOpenAction(true)}
              >
                수집하기
              </button>
            )}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-6">
          {!pathname.includes('/cafe/search/detail') && (
            <CategoryGrid category={parsedCategory ?? []} />
          )}
          <OpenTimeGrid openingHours={detail?.openingHours} />
          <LocationGrid address={detail?.address} />
          <PhoneGrid phoneNum={detail?.phoneNum} />
          <MenuGrid
            handleMenuOpenAction={handleMenuOpenAction}
            isDarkTheme={isDarkTheme}
            menu={menu}
          />
        </section>
      </main>
    </div>
  );
}
