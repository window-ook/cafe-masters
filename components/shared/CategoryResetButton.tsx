import { RotateCcw } from 'lucide-react';

export interface ICategoryResetButton {
  onReset: () => void;
}

export default function CategoryResetButton({ onReset }: ICategoryResetButton) {
  return (
    <button
      type="button"
      aria-label="카테고리 초기화 버튼"
      className="bg-main-light/80 border border-main/30 text-main px-4 py-2 rounded-full flex justify-center items-center cursor-pointer backdrop-blur-md transition-all duration-200 ease-out hover:bg-main-light"
      onClick={onReset}
    >
      <RotateCcw className="size-4" />
    </button>
  );
}
