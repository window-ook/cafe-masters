'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUIStore, useUserStore } from '@/stores';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CollectionCafe from '@/components/collection/CollectionCafe';

/** 바인더 내지 위에 놓이는 조작면. 유리가 아니라 눌리는 판으로 읽혀야 합니다 */
const ARROW_BUTTON_BASE =
  'absolute top-1/2 z-30 -translate-y-1/2 border p-3 cursor-pointer rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100';

export default function CollectionCafeCarousel() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const session = useUserStore(state => state.session);

  const {
    collectionCafes,
    filteredCollectionCafes,
    totalFilteredCount,
    isPending,
    isError,
  } = useCollectionCafes(session?.user?.id ?? '', 1, 100, false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  const scrollPrev = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = 352 + 16;
    container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  }, []);

  const scrollNext = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const cardWidth = 352 + 16;
    container.scrollBy({ left: cardWidth, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollPrev();
      if (e.key === 'ArrowRight') scrollNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  const handleCollectionCafeClick = useCafeClick<ISupabaseCollectionCafe>({
    routePath: 'collection',
  });

  useEffect(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  if (isPending) {
    return (
      <div
        className={`fixed right-4 bottom-6 left-4 z-40 border px-6 py-4 sm:left-[calc(24rem)] ${
          isDarkTheme
            ? 'border-binder-edge bg-binder'
            : 'border-binder-edge-light bg-binder-light'
        } rounded-2xl shadow-2xl`}
      >
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="skeleton-shimmer h-80 min-w-64 animate-pulse rounded-xl bg-gray-200/50 dark:bg-gray-700/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) return null;
  if (!session) return null;
  if (collectionCafes?.length === 0) return null;
  if (totalFilteredCount === 0) return null;

  return (
    <div
      className={`fixed right-4 bottom-12 left-4 z-40 mx-10 hidden rounded-2xl border px-6 py-4 ${
        isDarkTheme
          ? 'border-binder-edge bg-binder'
          : 'border-binder-edge-light bg-binder-light'
      } shadow-2xl sm:left-[calc(24rem)] sm:block`}
    >
      {/* 인디케이터 */}
      <div className="mb-2 flex items-center gap-2">
        <h2
          className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
        >
          내 컬렉션
        </h2>
        <p className="bg-main rounded-full px-3 py-1 text-lg font-bold text-white transition duration-150 ease-in">
          {totalFilteredCount}
        </p>
      </div>

      <div className="carousel-wrapper relative">
        <button
          onClick={scrollPrev}
          disabled={!canScrollLeft}
          aria-label="이전 카드"
          className={`left-0 ${ARROW_BUTTON_BASE} ${
            isDarkTheme
              ? 'border-white/15 bg-white/10 hover:bg-white/20'
              : 'border-black/10 bg-black/5 hover:bg-black/10'
          }`}
        >
          <ChevronLeft className="text-main size-6" />
        </button>

        <div
          ref={carouselRef}
          className="carousel-scroll-container"
          onScroll={handleScroll}
        >
          {filteredCollectionCafes?.map((cafe: ISupabaseCollectionCafe) => (
            <div key={cafe.id} className="carousel-card-item">
              <CollectionCafe
                name={cafe.name}
                ratings={cafe.ratings!}
                material={cafe.material ?? null}
                image={cafe.image}
                address={cafe.address}
                phone_number={cafe.phone_number!}
                created_at={cafe.created_at}
                onClickAction={() => handleCollectionCafeClick(cafe)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollRight}
          aria-label="다음 카드"
          className={`right-0 ${ARROW_BUTTON_BASE} ${
            isDarkTheme
              ? 'border-white/15 bg-white/10 hover:bg-white/20'
              : 'border-black/10 bg-black/5 hover:bg-black/10'
          }`}
        >
          <ChevronRight className="text-main size-6" />
        </button>
      </div>
    </div>
  );
}
