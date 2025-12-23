import { LoadingSpinner } from '@/components/shared/sliding-drawer/LoadingSpinner';

export default function KakaoMapFallback() {
    return (
        <figure
            id="map"
            aria-label="kakao map"
            className="fixed z-0 top-4 right-4 bottom-4 left-4 sm:left-[calc(25rem)] rounded-3xl shadow-sm overflow-hidden"
        >
            <LoadingSpinner size="2xl" className="w-full h-full" />
        </figure>
    );
}