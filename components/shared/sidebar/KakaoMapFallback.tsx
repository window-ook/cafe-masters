import { LoadingSpinner } from '@/components/shared/sliding-drawer/LoadingSpinner';

export default function KakaoMapSkeleton() {
    return (
        <figure
            id="map"
            aria-label="kakao map"
            className="fixed z-0 top-0 w-screen h-screen sm:translate-x-108 sm:w-[calc(100vw-27rem)]"
        >
            <LoadingSpinner size="2xl" className="w-full h-full" />
        </figure>
    );
}