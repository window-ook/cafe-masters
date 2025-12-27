import { RotateCcw } from 'lucide-react';

export interface ICategoryResetButton {
  onReset: () => void;
}

export default function CategoryResetButton({ onReset }: ICategoryResetButton) {
  return (
    <button
      type="button"
      aria-label="카테고리 초기화 버튼"
      className="border-main/30 bg-main-light/80 text-main hover:bg-main-light flex items-center justify-center rounded-full border px-4 py-2 backdrop-blur-md transition-all duration-200 ease-out"
      onClick={onReset}
    >
      <RotateCcw className="size-4" />
    </button>
  );
}
