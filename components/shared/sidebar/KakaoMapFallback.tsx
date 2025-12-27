import { LoadingSpinner } from '@/components/shared/sliding-drawer/LoadingSpinner';

export default function KakaoMapFallback() {
  return (
    <figure
      id="map"
      aria-label="kakao map"
      className="fixed top-4 right-4 bottom-4 left-4 z-0 overflow-hidden rounded-3xl shadow-sm sm:left-[calc(25rem)]"
    >
      <LoadingSpinner size="2xl" className="h-full w-full" />
    </figure>
  );
}
