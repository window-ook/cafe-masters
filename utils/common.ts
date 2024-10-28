import { toast } from 'react-toastify';

export const handleCopyClick = async (param: any) => {
  try {
    await navigator.clipboard.writeText(param);
    toast.success('클립보드에 복사되었습니다!');
  } catch (error) {
    toast.error('다시 시도해주세요.');
  }
};
