interface ILoadingSpinner {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
  '2xl': 'size-12',
};

/** 로딩 스피너
 * @description 검색 결과 카페의 상세 정보 로딩 중 버튼 위 fallback UI
 */
export function LoadingSpinner({
  size = 'lg',
  className = '',
}: ILoadingSpinner) {
  const spinnerSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div
          className={`rounded-full border-4 border-gray-200 ${spinnerSize}`}
        ></div>
        <div
          className={`border-t-main absolute top-0 left-0 animate-[spin_500ms_ease-out_infinite] rounded-full border-4 border-transparent ${spinnerSize}`}
        ></div>
      </div>
    </div>
  );
}
