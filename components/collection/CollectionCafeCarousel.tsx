'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUIStore, useUserStore } from 'stores';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CollectionCafe from '@/components/collection/CollectionCafe';

export default function CollectionCafeCarousel() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const session = useUserStore(state => state.session);

  const {
    collectionCafes,
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

  const handleCollectionCafeClick = useCafeClick<ISupabaseCollectionCafe>({ routePath: 'collection' });

  useEffect(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);


  if (isPending) {
    return (
      <div className={`
        fixed bottom-6 left-4 right-4 sm:left-[calc(24rem)] z-40 
        px-6 py-4
        rounded-2xl
        ${isDarkTheme
          ? 'bg-gray-900/40 border-gray-700/30'
          : 'bg-white/40 border-white/50'
        }
        backdrop-blur-xl border
        shadow-2xl
      `}>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-64 h-80 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl animate-pulse skeleton-shimmer"
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
    <div className="
      hidden sm:block
      fixed bottom-12 left-4 right-4 sm:left-[calc(24rem)] z-40 px-6 py-4 mx-10
      rounded-2xl shadow-2xl
      backdrop-blur-xl border
      bg-white/30 border-white/30
    ">
      {/* 인디케이터 */}
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-2xl font-bold text-text-primary">
          내 컬렉션
        </h2>
        <p className="font-bold text-lg text-white px-3 py-1 rounded-full bg-main transition duration-150 ease-in">
          {totalFilteredCount}
        </p>
      </div>

      <div className="carousel-wrapper relative">
        <button
          onClick={scrollPrev}
          disabled={!canScrollLeft}
          aria-label="이전 카드"
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 z-30
            p-3 rounded-full
            ${isDarkTheme
              ? 'bg-white/20 hover:bg-white/30'
              : 'bg-white/20 hover:bg-white/30'
            }
            backdrop-blur-xl border border-white/30 shadow-lg
            hover:scale-110 active:scale-95
            transition-all duration-300 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
        >
          <ChevronLeft className="size-6 text-main" />
        </button>

        <div
          ref={carouselRef}
          className="carousel-scroll-container"
          onScroll={handleScroll}
        >
          {collectionCafes?.map((cafe: ISupabaseCollectionCafe) => (
            <div key={cafe.id} className="carousel-card-item">
              <CollectionCafe
                name={cafe.name}
                ratings={cafe.ratings!}
                image={cafe.image}
                address={cafe.address}
                phone_number={cafe.phone_number!}
                onClickAction={() => handleCollectionCafeClick(cafe)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollRight}
          aria-label="다음 카드"
          className={`
            absolute right-0 top-1/2 -translate-y-1/2 z-30
            p-3 rounded-full
            ${isDarkTheme
              ? 'bg-white/20 hover:bg-white/30'
              : 'bg-white/20 hover:bg-white/30'
            }
            backdrop-blur-xl border border-white/30 shadow-lg
            hover:scale-110 active:scale-95
            transition-all duration-300 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
        >
          <ChevronRight className="size-6 text-main" />
        </button>
      </div>
    </div>
  );
}
