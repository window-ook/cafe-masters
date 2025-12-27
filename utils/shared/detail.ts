'use client';

import { RefObject } from 'react';
import { TOAST_ERROR, TOAST_SUCCESS } from '@/utils/constants/messages';
import { toast } from 'react-toastify';

/** 클립보드 복사 */
export const copyText = async (param: string) => {
  try {
    await navigator.clipboard.writeText(param);
    toast.success(TOAST_SUCCESS.COPY_TO_CLIPBOARD);
  } catch {
    toast.error(TOAST_ERROR.RETRY);
  }
};

/** 카페 상세 UI 썸네일 무한 슬라이드 스크롤 */
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