'use client';

import { RefObject } from 'react';
import { toast } from 'react-toastify';

/** 클립보드 복사 */
export const copyText = async (param: string) => {
  try {
    await navigator.clipboard.writeText(param);
    toast.success('클립보드에 복사되었습니다!');
  } catch {
    toast.error('다시 시도해주세요.');
  }
};

/** 썸네일 슬라이드 스크롤 */
export const scrollThumbnails = (direction: 'left' | 'right', scrollRef: RefObject<HTMLDivElement>) => {
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