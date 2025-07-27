import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui';
import { useMapStore } from '@/stores/map';

/**
 * 카페 클릭 핸들러 공통 타입 인터페이스
 */
interface ICafeClickData {
  id: string | number;
  coordX?: number;
  coordY?: number;
  x?: number;
  y?: number;
}

/**
 * 카페 클릭 핸들러 옵션
 */
interface ICafeClickHandlerOptions {
  /** 라우팅 경로 (예: 'recommended', 'collected', 'bookmarked', 'search') */
  routePath: string;
  /** 현재 카페 ID 설정 여부 (기본값: false) */
  shouldSetCurrentCafeId?: boolean;
}

/**
 * 카페 클릭 핸들러 제네릭 훅
 * 
 * @template T - 카페 데이터 타입 (ICafeClickData를 확장해야 함)
 * @param options - 핸들러 옵션
 * @returns 카페 클릭 핸들러 함수
 */
export function useCafeClickHandler<T extends ICafeClickData>(
  options: ICafeClickHandlerOptions
) {
  const router = useRouter();

  const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);
  const currentCafeId = useMapStore(state => state.currentCafeId);
  const setCurrentCafeId = useMapStore(state => state.setCurrentCafeId);
  const setCurrentCoordX = useMapStore(state => state.setCurrentCoordX);
  const setCurrentCoordY = useMapStore(state => state.setCurrentCoordY);

  const { routePath, shouldSetCurrentCafeId = false } = options;

  const handleCafeClick = useCallback((cafe: T) => {
    // ID 타입에 따른 비교 (string 또는 number)
    const cafeId = typeof cafe.id === 'string' ? cafe.id : Number(cafe.id);
    const currentId = typeof currentCafeId === 'string' ? currentCafeId : Number(currentCafeId);

    // 중복 클릭 방지
    if (cafeId === currentId) return;

    // 슬라이딩 드로어 열기
    setIsSlidingDrawerOpen(true);

    // 라우팅
    router.push(`/${routePath}/detail/${cafe.id}`);

    // 좌표 설정 (coordX/coordY 또는 x/y 지원)
    const coordX = cafe.coordX ?? cafe.x ?? 0;
    const coordY = cafe.coordY ?? cafe.y ?? 0;
    setCurrentCoordX(coordX);
    setCurrentCoordY(coordY);

    // 현재 카페 ID 설정 (옵션)
    if (shouldSetCurrentCafeId) {
      const cafeIdAsNumber = typeof cafe.id === 'string' ? parseInt(cafe.id) : cafe.id;
      setCurrentCafeId(cafeIdAsNumber);
    }
  }, [
    currentCafeId,
    router,
    routePath,
    shouldSetCurrentCafeId,
    setIsSlidingDrawerOpen,
    setCurrentCafeId,
    setCurrentCoordX,
    setCurrentCoordY
  ]);

  return handleCafeClick;
}