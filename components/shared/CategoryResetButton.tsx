import { RotateCcw } from 'lucide-react';

export interface ICategoryResetButton {
  onReset: () => void;
}

export default function CategoryResetButton({ onReset }: ICategoryResetButton) {
  return (
    <button
      type="button"
      aria-label="카테고리 초기화 버튼"
      className="px-4 py-2 rounded-full border border-main/30 bg-main-light/80 backdrop-blur-md flex justify-center items-center text-main transition-all duration-200 ease-out hover:bg-main-light"
      onClick={onReset}
    >
      <RotateCcw className="size-4" />
    </button>
  );
}
