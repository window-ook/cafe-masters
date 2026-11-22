'use client';

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
